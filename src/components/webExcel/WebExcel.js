;(function (exports, Component, lang) {


    exports.WebExcel = Component.extend({

        doc: document,

        initialize: function (options) {
            this.DomList = [];
            // 创建 node
            this.node = this.doc.createElement('div');
            this.node.setAttribute('class', 'web-excel');
        },

        beforeRender: function (node) {
            console.log('beforeRender', node);
        },

        afterRender: function (node) {
            console.log('afterRender', node);
        },

        render: function () {
            this.beforeRender(this.node);
            this.content = this.node.outerHeight;

            var node = null;

            lang.forEach(this.model.data, function (v) {
                node = this.renderOne(v);
                this.DomList.push(node);
                this.node.appendChild(node);
            }, this);

            this.attachToDOM(this.parent);
            return this.node;
        },

        renderOne: function (model) {
            var div = this.doc.createElement('div');
            var html = [];
            var keys = lang.keys(model);

            lang.forEach(keys, function (prop) {
                html.push('<div data-cell-name="'+
                    prop + '" class="cell">' +
                    model[prop] + '</div>');
            }, this);

            div.innerHTML = html.join('\n');
            div.setAttribute('class', 'list-item');

            return div;
        }
    });

})(window, Component, lang);
