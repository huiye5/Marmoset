;(function (exports, Model) {

    function WebExcelModel(listNumber) {
        this.initialize(listNumber);
    }

    WebExcelModel.prototype.initialize = function (listNumber) {
        this.data = Model.dataList(listNumber);
    };

    exports.WebExcelModel = WebExcelModel;

})(window, Model);
