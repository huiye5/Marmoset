;
(function (exports) {

    var Modules = {};
    var loaderUrl = getCurrentScript();

    var BASE = loaderUrl.replace(/\/\w+\.js/, '');
    var ROOT = location.origin;
    var PATH = BASE.replace(ROOT, '').replace(/^\//, '').split(/\//);
    var ROOT_PATH = /^\//;
    var PARENT_PATH = /\.\.\//g;
    var CURRENT_PATH = /^\.\//;

    function parseUri(uri) {
        if (typeof uri !== 'string') {
            return uri;
        }

        if (ROOT_PATH.test(uri)) {
            return ROOT + uri;
        }

        if (CURRENT_PATH.test(uri)) {
            return BASE + uri.replace(CURRENT_PATH, '/');
        }

        if (PARENT_PATH.test(uri)) {
            var len = uri.match(PARENT_PATH).length;
            if (len > PATH.length) {
                throw new Error('path parse error');
            }

            uri = uri.replace(PARENT_PATH, '');

            var start = PATH.length - len;
            for (var i = 0; i < start; i++) {
                uri = PATH[i] + '/' + uri;
            }

            return ROOT + '/' + uri;
        }
        return BASE + '/' + uri;
    }

    function parseJs(uri) { return parseUri(uri) + '.js'; }

    function getCurrentScript() {
        return document.currentScript.src;
    }

    function Module(uri, deps, factory) {
        this.uri = uri;
        this.deps = Module.resolve(deps);
        this.factory = factory;
        this.entry = [];
    }

    Module.prototype.load = function () {
        if (this.deps.length) {
            for (var i = 0; i < this.deps.length; i++) {
                new ImportScript(this.deps[i], Module.useFactory(this.deps[i])).load();
            }
        }
    };

    Module.prototype.exec = function () {
        return this.exports = this.factory.apply(null, Module.require(this.deps))
    };


    Module.require = function (deps) {
        var ret = [];
        for (var i = 0; i < deps.length; i++) {
            ret.push(Modules[deps[i]].exec());
        }
        return ret;
    };

    Module.loaded = function (id) {
        return Modules[id];
    };

    Module.resolve = function (deps) {
        return deps.map(function (v) {
            return parseJs(v);
        });
    };

    Module.dynamicDeps = Module.useFactory = null;

    Module.add = function (name, deps, factory) {
        var mod = new Module(name, deps, factory);
        Modules[getCurrentScript()] = mod;
        mod.load();
        Module.addDynamicDeps(Module.resolve(deps));
    };

    Module.addDynamicDeps = function (deps) {
        var dynamic = Module.dynamicDeps || (Module.dynamicDeps = []);
        deps.forEach(function (v) {
            if (dynamic.indexOf(v) === -1) {
                dynamic.push(v);
            }
        });
        return dynamic;
    };

    Module.createUseFactory = function (name, deps, factory) {
        Module.useFactory = function (n) {
            return function () {
                var index = Module.dynamicDeps.indexOf(n);
                if (index !== -1) {
                    Module.dynamicDeps.splice(index, 1);
                }

                if (!Module.dynamicDeps.length) {
                    factory.apply(null, Module.require([name].concat(deps)));
                    Module.useFactory = Module.dynamicDeps = null;
                }
            }
        }
    };

    Module.get = function (name, deps, factory) {
        var uri = parseJs(name);
        deps = Module.resolve(deps);

        // 创建回调
        Module.createUseFactory(uri, deps, factory);

        // 添加动态监控依赖
        Module.addDynamicDeps([uri].concat(deps));
        // 引入文件
        new ImportScript(uri, Module.useFactory(uri)).load();
        // 依赖
        deps.forEach(function (v) {
            new ImportScript(v, Module.useFactory(v)).load()
        });
    };

    exports.Module = Module;

})(window);
