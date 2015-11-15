;
(function (exports) {

    var Modules = {};

    function Module(uri, deps, factory) {
        this.uri = uri;
        this.deps = deps;
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

    Module.dynamicDeps = Module.useFactory = null;

    Module.add = function (name, deps, factory) {
        Modules[name] = new Module(name, deps, factory);
        Modules[name].load();
        Module.addDynamicDeps(deps);
    };

    Module.addDynamicDeps = function (deps) {
        var dynamic = Module.dynamicDeps || (Module.dynamicDeps = []);
        deps.forEach(function (v) {
            if (dynamic.indexOf(v) === -1) {
            }
            dynamic.push(v);
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
        // 创建回调
        Module.createUseFactory(name, deps, factory);
        // 添加动态监控依赖
        Module.addDynamicDeps([name].concat(deps));
        // 引入文件
        new ImportScript(name, Module.useFactory(name)).load();
        // 依赖
        deps.forEach(function (v) {
           new ImportScript(v, Module.useFactory(v)).load()
        });
    };

    exports.Module = Module;

})(window);
