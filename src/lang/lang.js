;(function () {
    var root = typeof self === 'object' && self.self === self && self ||
        typeof global === 'object' && global.global === global && global ||
        this;

    var lang = root.lang = {};

    lang.version = '0.1.0';

    var ArrayProto = Array.prototype,
        ObjectProto = Object.prototype;

    var nativeIsArray = Array.isArray,
        nativeForEach = Array.forEach,
        nativeKeys = Object.keys,
        nativeCreate = Object.create;

    var hasOwnProperty = ObjectProto.hasOwnProperty;

    // If len ≤ +0, return +0.
    // If len is +∞, return 253-1.
    var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;

    function isType (type) {
        return function (obj) {
            return Object.prototype.toString.call(obj) === '[object ' + type + ']';
        };
    }

    function isArrayLike (obj) {
        var len = obj && obj.length;
        return typeof len === 'number' && len >= 0 && len <= MAX_ARRAY_INDEX;
    }

    function each(obj, iterator, context){
        if(typeof iterator !== 'function') return obj;

        var i;

        if(isArrayLike(obj)){
            for(i = 0; i < obj.length; i++){
                iterator.call(context, obj[i], i, obj);
            }
        }else{
            for( i in obj){
                if (!obj.hasOwnProperty(i)) continue;
                iterator.call(context, obj[i], i, obj);
            }
        }
    }

    // 类型判定
    var objectTypes = ['Function', 'Object', 'Array', 'String',
        'RegExp', 'Undefined', 'Date', 'Error', 'Arguments', 'Number'];

    each(objectTypes, function (name) {
        lang['is' + name] = isType(name);
    });

    lang.isNaN = function (obj) {
        return obj !== obj;
    };

    var _isNumber = lang.isNumber;

    lang.isNumber = function (num) {
        return  !lang.isNaN(num) && _isNumber(num);
    };

    /********************* 功能函数 ***************************/

    lang.each = lang.forEach = each;

    function Constructor() {}

    function create(prototype){
        var result;
        if (!lang.isObject(prototype)) return {};
        Constructor.prototype = prototype;
        result = new Constructor();
        Constructor.prototype = null;
        return result;
    }

    function keys(obj){
        // todo
        // ie9 有一些属性不能通过 for in 查出
        // 需要解决
        var _keys = [];
        lang.each(obj, function (v, i) {
            _keys.push(i);
        });
        return _keys;
    }

    lang.create = nativeCreate || create;

    lang.extend = function (target, destination) {
        lang.each(destination, function (v, p) {
            this[p] = v;
        }, target);
    };

    lang.keys = nativeKeys || keys;

    lang.inherit = function (Supper, Child) {
        if ( !(lang.isFunction(Supper) &&
            lang.isFunction(Child)) ) return Child;

        // 缓存 Child.prototype
        var _childPrototype = Child.prototype;

        // 继承 this.xxx
        Child.prototype = new Supper();
        // 继承Supper.prototype
        lang.extend(Child.prototype, lang.create(Supper.prototype));
        // 拿回Child.prototype本身的
        lang.extend(Child.prototype, _childPrototype);

        return Child;
    };

})();
