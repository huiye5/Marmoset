;(function (exports, Component) {

    exports.WebExcel = Component.extend({

        beforeRender: function (node) {
            console.log('beforeRender', node);
        },

        afterRender: function (node) {
            console.log('afterRender', node);
        },

        render: function (model) {
            this.beforeRender(this.node);
            this.node.innerHTML = '<div>123</div>';
            this.content = this.node.outerHTML;
        }
    });

})(window, Component);
