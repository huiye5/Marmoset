/**
 * Created by 灰也 on 2015/11/17.
 */
;(function(global){
	'use strict'
	
	//if (global.Promise) {return};

	function isType (type) {
		return function (obj) {
			return Object.prototype.toString.call(obj) === "[object " + type + "]";
		}
	}
	var isFunction = isType("Function");

	//	Promise
	var Promise = function(fn) {
		if (!(this instanceof Promise)) {
			return new Promise(fn);
		};
		this.state = 0;//0:pending(初始)、1:fulfilled(成功)、2:rejected(失败)

		var data = this._data = {};
		data.thens = [];

		fn && fn(this.resolve.call(this),this.reject(this));


		//this.doneArry = [];//完成回调
		//this.failArry = [];//失败回调
		//this.state = 'pending';//当前状态
		//debugger
		//this.into(pendingFunc);
		//return this;
	};

	//初始化
	Promise.prototype.into = function(pendingFunc){
		pendingFunc.apply(this,this.resolve,this.reject);
	}
	//成功
	Promise.prototype.resolve = function(){
		this.state = 'fulfilled';
		var arr = this.doneArry;
		debugger
		for(var i = 0, len = arr.length; i < len; i++) {
			arr[0].call(this);
			arr.shift();
		}
	}
	//成功回调添加
	Promise.prototype.done = function(resolveFunc){
		if(isFunction(resolveFunc)) {
			this.doneArry.push(resolveFunc);
		}
		return this;
	}
	//失败
	Promise.prototype.reject = function(){
		this.state = 'rejected';
		var arr = this.failArry;
		for(var i = 0, len = arr.length; i < len; i++) {
			arr[0].call(this);
			arr.shift();
		}
	}
	//失败回调添加
	Promise.prototype.fail = function(rejectFunc){
		if(isFunction(rejectFunc)) {
			this.failArry.push(rejectFunc);
		}
		return this;
	}
	//添加
	Promise.prototype.then = function(resolveFunc,rejectFunc){
		this.done(resolveFunc).fail(rejectFunc);
		return this;
	}

	Promise.constructor = Promise;

	// window is promise
	global.Promise = Promise;
})(window)