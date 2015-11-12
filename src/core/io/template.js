
(function (exports) {

    function Template() {
        if (!(this instanceof Template)) {
            return new Template();
        }

        // 开始和结束标记可自由配置
        this.startTag = '<%';
        this.endTag = '%>';
    }

    // 过滤注释
    Template.prototype.filterComment = function (content) {

    };

    // 将内容编译成函数
    Template.prototype.compile = function (content) {

    };


    // 将字符转换成函数体
    Template.prototype.analysisString = function (content) {

    };

    // 转码html
    Template.prototype.encodingHTML = function () {

    };


    exports.Template = Template;
})(window);
