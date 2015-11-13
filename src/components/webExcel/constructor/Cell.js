;(function (exports, Component) {

    exports.Cell = Component.extend({

        doc: document,

        initialize: function (options) {
            this.name = options.name;

            this.inputNode = null;
            this.textNode = null;

            this.node = this.doc.createElement('div');
            this.node.setAttribute('class', 'cell');
        },

        render: function () {
            this.node.setAttribute('data-cell-name', this.name);
            this.node.setAttribute('data-mark', this.x + ':' + this.y);
            this.textNode = this.doc.createTextNode(this.model[this.name]);
            this.node.appendChild(this.textNode);

            return this.node;
        },

        replaceToValue: function (val) {
            if(val){
                this.textNode.nodeValue = val;
                this.node.removeChild(this.inputNode);
                this.node.appendChild(this.textNode);
            }
            return val;
        },

        replaceToInput: function () {
            if (!this.inputNode){
                this.inputNode = this.doc.createElement('input');
                this.inputNode.setAttribute('class', 'cell-input');
            }

            this.inputNode.setAttribute('value', this.model[this.name]);

            this.node.removeChild(this.textNode);
            this.node.appendChild(this.inputNode);
        },

        saveModel: function (val) {
            if(val){
                this.model[this.name] = val;
                this.replaceToValue(val);
            }
            return val;
        },

        renderToString: function () {
            return this.content = this.node.outerHTML;
        }
    });

})(window, Component);
