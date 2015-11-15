/**
 * 1. 定义一个 Module
 * define(name, [dependents], factory)
 *
 * 2. 使用一个 Module
 * use(name, [dependents], factory)
 *
 * 每一个模块定义成一个 Module，包含如下信息
 * 1.uri
 * 2.name
 * 3.factory
 * 4.dependents
 *
 * 使用一个module的时候，要先取得这个module
 * 所以需要一个 get 方法
 *
 * Module.get = fn
 *
 * get 时，如果已经加载了，直接从缓存中取出即可
 * 如果没有加载，则需要一个 load 方法
 *
 * Module.prototype.load = fn
 *
 * 也就相当于 getter 和 setter 方法了。
 *
 * 自此将会衍生出诸如：save, parseUri, loadResource 等方法
 *
 */

;
(function (exports) {

    var doc = document,
        head = doc.head,
        loader = {};

    function ImportScript(uri, done, fail) {
        this.uri = uri + '.js';
        this._done = done;
        this._fail = fail;
    }

    ImportScript.prototype.done = function () {
        this._done();
        head.removeChild(this.node);
    };

    ImportScript.prototype.fail = function () {
        this._fail();
        throw new Error('failed to load ' + this.uri);
    };

    ImportScript.prototype.load = function () {
        if (Module.loaded(this.uri)) {
            this.done();
            return this;
        }
        this.node = doc.createElement('script');
        this.node.src = this.uri;
        this.node.onload = this.done.bind(this);
        this.node.onerror = this.fail.bind(this);
        head.appendChild(this.node);

        return this.node;
    };

    //
    //
    exports.define = function (name, deps, factory) {
        Module.add(name, deps, factory);
    };

    loader.use = function (name, deps, factory) {
        Module.get(name, deps, factory);
    };

    exports.ImportScript = ImportScript;
    exports.loader = loader;
})(window);
