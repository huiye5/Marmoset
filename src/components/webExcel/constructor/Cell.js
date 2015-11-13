;(function (exports, Component) {

    exports.Cell = Component.extend({

        doc: document,

        initialize: function (options) {
            this.node = this.doc.createElement('div');
            this.node.setAttribute('class', 'cell');
        },

        render: function () {
            this.node.setAttribute('data-cell-name', this.model.name);
            this.node.setAttribute('data-mark', this.x + ':' + this.y);
            this.node.innerHTML = this.model.value;

            this.content = this.node.outerHTML;
            return this.node;
        }
    });

})(window, Component);
