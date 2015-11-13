;(function (exports, lang) {

    // 所有的方法，先不做兼容
    var event = {};

    // 现在验证三种选择器
    // id, class, tagName
    var cssSelectorType = {
        ID: /(?:^#\w+$)/,
        // .a 或 .a.b..
        CLASS: /(?:\.\w+)+/,
        // tagName
        TAG: /(?:[a-zA-z]+)/
    };

    var c = {
        type: function (selector) {
            var type = null;
            lang.each(cssSelectorType, function (r, t) {
                return r.test(selector) && (type = t);
            });
            return type;
        },

        isSelector: function (node, selector) {
            var handle = this.hooks[this.type(selector)];
            return lang.isFunction(handle) ?
                handle(node, selector) :
                false;
        },

        hooks: {
            /**
             * @return {boolean}
             */
            ID: function (node, str) {
                return node.getAttribute('id') === str;
            },

            /**
             * @return {boolean}
             */
            CLASS: function (node, str) {
                var styleNames = node.classList ||
                    node.getAttribute('class').split(' ');
                var matchStyleName = str.split('.').splice(1);
                var match = true;

                lang.forEach(matchStyleName, function (v) {
                    match = lang.indexOf(styleNames, v) !== -1;
                });

                return match;
            },

            /**
             * @return {boolean}
             */
            TAG: function (node, str) {
                return node.tagName.toLocaleLowerCase() ===
                    str.toLocaleLowerCase();
            }
        }
    };

    function on(node, type, handle, capture) {
        node.addEventListener(type, handle, capture);
        return node;
    }

    event.on = function (type, selector, handle, data) {
        var node = this[0];
        on(node, type, function (e) {
            var target = e.target;
            if (c.isSelector(target, selector)) {
                handle.call(target, e, data);
            }
        }, true);
    };


    exports.event = event;

})(window, lang);
