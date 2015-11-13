;(function (exports, lang) {
    exports.Model = {

        unique: function (prefix) {
            var start = 0;
            return function () {
                return (prefix || 'uuid-') + start++;
            };
        }(),

        // 生成一条数据
        one: function () {
            return {
                commodity: this.unique('commodity-'),
                essaCommodityCode: lang.range(100000, 200000),
                wrapperCode: lang.randomRange(10, 1, 20).join(''),
                innerCode: lang.randomRange(10, 0, 10).join(''),
                orderCode: lang.randomRange(6, 0, 10).join(''),
                // ascii 码中 A-Z及 a-z
                userCommodityCode:
                    lang.integerListToString(lang.randomRange(20, 65, 123)),
                date: new Date().toLocaleDateString()
            };
        },

        dataList: function (length) {
            var ret = [];
            for (var i = 0; i < length; i++) {
                ret.push(this.one());
            }
            return ret;
        }
    };

})(window, lang);
