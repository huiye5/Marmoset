;(function (scope, lang) {

    function Component(config) {
        if(!(this instanceof Component)){
            throw new Error('Constructor can\'t immediate called');
        }

        this.model = this.content = this.node = this.parent = null;
        this.width = this.height = this.x = this.y = null;
    }

    Component.prototype.render = function (model) {
        this.beforeRender(this.node);
        // todo render
        return this.node;
    };

    Component.prototype.beforeRender = function (node) {
        return this.node;
    };

    Component.prototype.afterRender = function (node) {
        return this.node;
    };

    Component.prototype.attachToDOM = function (parent) {
        // todo parent.appendChild(this.node);
        this.afterRender(this.node);
    };

    Component.prototype.renderToString = function () {
        return this.content;
    };

    Component.extend = function (options) {
        var Child = function(){};
        lang.inherit(Component, Child);
        lang.extend(Child.prototype, options);
        return Child;
    };

    scope.Component = Component;
})(window, lang);

