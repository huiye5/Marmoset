;(function (exports, event, lang) {

    var doc = document;
    var version = '0.1.0';
    var arr = [];

    var query = function (selector, context) {
        return new query.fn.init(selector, context);
    };

    query.fn = query.prototype = {

        length: 0,

        version: version,

        constructor: query,

        query: function (selector, context) {
            return this.isNode(selector) ?
                [selector] :
                this.ensureContext(context)
                    .querySelectorAll(selector) || [];
        },

        ensureContext: function (context) {
            return this.isNode(context) ? context : doc;
        },

        isNode: function (node) {
            return node && node.nodeType === 1;
        },

        push: arr.push,
        sort: arr.sort,
        splice: arr.splice
    };

    query.fn.init = function (selector, context) {
        if (!selector) { return this; }
        return query.merge(query(null), this.query(selector, context));
    };

    query.fn.init.prototype = query.fn;

    query.merge = function(first, second) {
        var i = first.length,
            len = second.length,
            j = 0;

        for (; j < len; j++) {
            first[i++] = second[j];
        }
        first.length = i;
        return first;
    };

    // 将 event 方法扩展给 query
    lang.extend(query.prototype, event);

    exports.query = query;

})(window, event, lang);
