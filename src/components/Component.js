;(function (exports, lang) {

    var componentsDefaults = [
        'x', 'y', 'model', 'content', 'node', 'parent', 'width', 'height',
        'initialize', 'beforeRender', 'afterRender', 'attachToDOM',
        'beforeRender', 'renderToString', 'render'
    ];

    function extend (options) {
        var Child = function (options) {
            if (!(this instanceof Child)) {
                throw new Error('Constructor can\'t immediate called');
            }
            this._extendFromOptions(options);
            this.initialize.apply(this, arguments);
        };

        lang.inherit(this, Child);
        lang.extend(Child.prototype, options);
        Child.extend = extend;

        return Child;
    }

    function Component(options) {
        if(!(this instanceof Component)){
            throw new Error('Constructor can\'t immediate called');
        }

        this.model = this.content = this.node = this.parent = null;
        this.width = this.height = this.x = this.y = null;

        this.__extendFromOptions(options);
        this.initialize.apply(this, arguments);
    }

    Component.prototype._extendFromOptions = function (options) {
        if (!lang.isObject(options)) { return options; }

        lang.forEach(componentsDefaults, function (v) {
            if (options.hasOwnProperty(v)){
                this[v] = options[v];
            }
        }, this);

        return options;
    };

    Component.prototype.initialize = function (options) {
        // console.log('Component initialized');
    };

    Component.prototype.render = function (model) {
        this.beforeRender(this.node);
        // todo render
        return this.node;
    };

    Component.prototype.beforeRender = function (node) {
        return node;
    };

    Component.prototype.afterRender = function (node) {
        return node;
    };

    Component.prototype.attachToDOM = function (parent) {
        parent = parent || this.parent;
        if ( parent && parent.nodeType === 1) {
            parent.appendChild(this.node);
        }
        return this.afterRender(this.node);
    };

    Component.prototype.renderToString = function () {
        return this.content || (this.content = this.node && this.node.outerHTML || '');
    };

    Component.extend = extend;

    exports.Component = Component;

})(window, lang);

