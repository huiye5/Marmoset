;(function (exports, Component, Cell, lang) {


    exports.WebExcel = Component.extend({

        doc: document,

        initialize: function (options) {
            this.cells = [];
            this.selected = [];

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

            var node = null;

            lang.forEach(this.model.data, function (v, i) {
                node = this.renderOne(v, i);
                this.node.appendChild(node);
            }, this);

            this.content = this.node.outerHTML;

            this.attachToDOM(this.parent);
            this.event(this.node);

            return this.node;
        },

        renderOne: function (model, index) {
            var div = this.doc.createElement('div');
            var html = [];
            var keys = lang.keys(model);
            var cell = null;
            var cells = [];

            this.cells.push(cells);

            lang.forEach(keys, function (prop, idx) {
                cell = new Cell({
                    y: index, x: idx,
                    model: {name: prop, value: model[prop]}
                });

                cell.render();
                html.push(cell.renderToString());
                cells.push(cell);
            }, this);

            div.innerHTML = html.join('\n');
            div.setAttribute('class', 'list-item');

            return div;
        },

        event: function (node) {
            // todo 点击编辑事件
            this.bindEdit(node);

            // todo 选择复制事件
            this.bindDragCopy(node);

            // todo 鼠标选择复制事件
            this.bindMoveCopy(node);
        },

        bindEdit: function (node) {

        },

        bindDragCopy: function (node) {

        },

        bindMoveCopy: function (node) {

        }
    });

})(window, Component, Cell, lang);
