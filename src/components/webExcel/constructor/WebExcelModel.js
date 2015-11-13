;(function (exports, Model, lang) {

    function WebExcelModel(listNumber) {
        this.initialize(listNumber);
    }

    WebExcelModel.prototype.initialize = function (listNumber) {
        this.data = Model.dataList(listNumber);
        this.keys = lang.keys(this.data[0]);
    };

    WebExcelModel.prototype.getDataWithCoords = function (x, y) {
        return this.data[y][this.getPropWithX(x)];
    };

    WebExcelModel.prototype.getPropWithX = function (x) {
      return this.keys[x];
    };

    exports.WebExcelModel = WebExcelModel;

})(window, Model, lang);
