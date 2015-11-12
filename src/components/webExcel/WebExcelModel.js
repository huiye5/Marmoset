;(function (exports, Model) {

    function WebExcelModel(options) {
        this.initialize(options);
    }

    WebExcelModel.prototype.initialize = function (options) {
        this.data = Model.dataList(10);
    };

    exports.WebExcelModel = WebExcelModel;

})(window, Model);
