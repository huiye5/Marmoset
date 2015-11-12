;(function (Win) { 'use strict';

    var c = Win.lang = {};
    var noop = function(){};
    var Constructor = function () {};

    c.version = '0.1.0';

    var ObjectProto = Object.prototype;

    var
        // Array
        nativeIsArray = Array.isArray,
        nativeForEach = Array.forEach,

        // Object
        nativeKeys = Object.keys,
        nativeCreate = Object.create,

        // String
        nativeTrim = String.prototype.trim;


    // ==========
    // If len ≤ +0, return +0.
    // If len is +∞, return 253-1.
    var MAX_SAFE_INTEGER = Math.pow(2, 53) - 1;

    function isType (type) {
        return function (obj) {
            return ObjectProto.toString.call(obj) === '[object ' + type + ']';
        };
    }

    function isArrayLike (obj) {
        var len = obj && obj.length;
        return typeof len === 'number' && len >= 0 && len <= MAX_SAFE_INTEGER;
    }

    function toInteger(value) {
        var number = Number(value);
        if (isNaN(number)) { return 0; }
        if (number === 0 || !isFinite(number)) { return number; }
        return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
    }

    function getLength(obj){
        return Math.min(Math.max(toInteger(obj.length), 0), MAX_SAFE_INTEGER);
    }

    function each(obj, iterator, context){
        if(typeof iterator !== 'function' ||
            !(obj && obj.constructor === Object)) {return obj;}

        for( var i in obj){
            if (!obj.hasOwnProperty(i)) { continue; }
            if (iterator.call(context, obj[i], i, obj)){ break; }
        }
    }

    function _forEach (arr, iterator, context, fromIndex) {
        if(!isArrayLike(arr)){ return arr; }
        iterator = ensureCallback(iterator);
        for(var i = toInteger(fromIndex), len = getLength(arr); i < len; i++){
            if(iterator.call(context, arr[i], i, arr)) { break; }
        }
    }

    function forEach(arr, iterator, context) {
        iterator = ensureCallback(iterator);
        if (nativeForEach) {
            nativeForEach.call(arr, function () {
                iterator.apply(context, arguments);
            });
        }else{
            _forEach(arr, function (k, v, a) {
                iterator.call(context, k, v, a);
            }, context, 0);
        }
    }

    function ensureCallback(callback){
        return ObjectProto.toString.call(callback) === '[object Function]' ? callback : noop;
    }

    function create(prototype){
        if (nativeCreate) { return nativeCreate(prototype); }

        var result;
        if (!c.isObject(prototype)){ return {};}
        Constructor.prototype = prototype;
        result = new Constructor();
        Constructor.prototype = null;
        return result;
    }

    function keys(obj){
        if (nativeKeys) { return nativeKeys(obj); }
        // todo ie9 有一些属性不能通过 for in 查出=, 需要解决
        var _keys = [];
        c.each(obj, function (v, i) {
            _keys.push(i);
        });
        return _keys;
    }

    function trim(str) {
        if (!c.isString(str)) { return str; }
        // 凡是ascii码 <= 32 (空白符)，一律认为是空白符
        var start = 0, space = 32, last = str.length - 1, end = last;

        // 左边
        while (str.charCodeAt(start) <= space && start <= end){
            start++;
        }
        // 右边
        while (str.charCodeAt(end) <= space && end >= start){
            end--;
        }
        return (start > 0 || end < last) ?
            str.substring(start, end + 1) : str;
    }

    // isType
    var objectTypes = ['Function', 'Object', 'Array', 'String',
        'RegExp', 'Undefined', 'Date', 'Error', 'Arguments', 'Number'];

    _forEach(objectTypes, function (name) {
        this['is' + name] = isType(name);
    }, c);

    c.isNaN = function (obj) {return obj !== obj;};

    var _isNumber = c.isNumber;
    c.isNumber = function (num) {return  !c.isNaN(num) && _isNumber(num);};
    c.isArray = nativeIsArray || c.isArray;

    //
    // util
    c.each = each;
    c.forEach = _forEach;
    c.isArrayLike = isArrayLike;
    c.toInteger = toInteger;
    c.getLength = getLength;
    c.extend = function (target, destination) {
        c.each(destination, function (v, p) {
            this[p] = v;
        }, target);
    };
    c.inherit = function (Supper, Child) {
        if ( !(c.isFunction(Supper) &&
            c.isFunction(Child)) ) {return Child;}

        // 缓存 Child.prototype
        var cachePrototype = Child.prototype;

        // 继承 this.xxx
        Child.prototype = new Supper();
        // 继承Supper.prototype
        c.extend(Child.prototype, c.create(Supper.prototype));
        // 拿回Child.prototype本身的
        c.extend(Child.prototype, cachePrototype);

        return Child;
    };

    //
    // Object
    c.create = create;
    c.keys = keys;

    //
    // Array
    c.map = function(arr, callback, thisArg){
        if(!c.isArray(arr)){return arr;}
        var ret = [];
        _forEach(arr, function (v, i, a) {
            ret.push( callback.call(thisArg, v, i, a) );
        }, thisArg, 0);

        return ret;
    };
    c.every = function(arr, callback, thisArg){
        var ret = true;
        callback = ensureCallback(callback);

        _forEach(arr, function (k, v, a) {
            return !(ret = callback.call(thisArg, k, v, a));
        }, thisArg, 0);

        return ret;
    };
    c.fill = function(arrayLike, value, start, end){
        if (!isArrayLike(arrayLike) || c.isNaN(value)) { return arrayLike; }

        var len = getLength(arrayLike);

        start = toInteger(start);
        end = toInteger(end) || len;

        start = start < 0 ?
            Math.max(len + start, 0) :
            Math.min(start, len);

        end = end < 0 ?
            Math.max(len + end, 0) :
            Math.min(end, len);

        for(; start < end; start++){
            arrayLike[start] = value;
        }
        return arrayLike;
    };
    c.filter = function(arr, callback, thisArg){
        var ret;
        if(!c.isArray(arr)) { return arr; }

        ret = [];
        callback = ensureCallback(callback);

        _forEach(arr, function (v, k, a) {
            if (callback.call(thisArg, v, k, a)){ ret.push(v); }
        }, null, 0);

        return ret;
    };
    c.findIndex = function(arr, callback, thisArg, fromIndex){
        var index = -1;
        callback = ensureCallback(callback);

        _forEach(arr, function (v, k, a) {
            if(callback.call(thisArg, v, k, a)) { return (index = k) !== -1; }
        }, null, fromIndex);

        return index;
    };
    c.some = function (arr, callback, thisArg) {
        return c.findIndex(arr, callback, thisArg) !== -1;
    };
    c.indexOf = function (arr, value, fromIndex) {
        return c.findIndex(arr, function (k) {
            return k === value;
        }, null, fromIndex);
    };

    //
    // String
    //c.trim = nativeTrim ?
    //    function (str) { return nativeTrim.call(str); } :
    //    trim;
    c.trim = nativeTrim || trim;

})(window);
