;(function (exports, Component, Cell, lang, query, event) {


    exports.WebExcel = Component.extend({

        doc: document,

        initialize: function (options) {
            this.cells = [];
            this.selected = [];

            // 创建 node
            this.node = this.doc.createElement('div');
            this.node.setAttribute('class', 'web-excel');
            this.$node = query(this.node);
        },

        beforeRender: function (node) {
            // console.log('beforeRender', node);
        },

        afterRender: function (node) {
            // console.log('afterRender', node);
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
            this.event(this.$node);

            return this.node;
        },

        renderOne: function (model, index) {
            var div = this.doc.createElement('div');
            var cell = null;
            var cells = [];

            this.cells.push(cells);

            lang.forEach(this.model.keys, function (prop, idx) {
                cell = new Cell({
                    y: index, x: idx,
                    model: model, name: prop
                });

                cell.render();
                cells.push(cell);
                div.appendChild(cell.node);
            }, this);

            div.setAttribute('class', 'list-item');
            return div;
        },

        event: function ($node) {
            // todo 点击编辑事件
            this.bindEdit($node);

            // todo 选择复制事件
            this.bindDragCopy($node);

            // todo 鼠标选择复制事件
            this.bindMoveCopy($node);
        },

        bindEdit: function ($node) {
            var _this = this;

            $node.on('dblclick', '.cell', function (e, data) {
                var c = _this.getCoords(e.target);
                // 取得当前单元格数据
                _this.replaceToInput(c.x, c.y);
                console.log(data);
            }, 123);

            $node.on('blur', 'input', function (e) {
                var c = _this.getCoords(e.target.parentNode);
                _this.replaceToValue(c.x, c.y, e.target.value);
            });
        },

        getCoords: function (node) {
            var c = node.getAttribute('data-mark').split(':');
            return {x: lang.toInteger(c[0]), y: lang.toInteger(c[1])};
        },

        getCellsWithCoors: function (x, y) {
            return this.cells[y][x];
        },

        bindDragCopy: function ($node) {

        },

        bindMoveCopy: function ($node) {

        },

        replaceToInput: function (x, y) {
            this.getCellsWithCoors(x, y).replaceToInput();
        },

        replaceToValue: function (x, y, v) {
            this.getCellsWithCoors(x, y).saveModel(v);
        }
    });

})(window, Component, Cell, lang, query, event);
