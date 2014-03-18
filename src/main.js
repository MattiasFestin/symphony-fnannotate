'use strict';

var assert = require('symphony-fnassert'),
	_ = require('lodash');

var FN_ARGS = /^function\s*[^\(]*\(\s*([^\)]*)\)/m;
var FN_ARG_SPLIT = /,/;
var FN_ARG = /^\s*(_?)(\S+?)\1\s*$/;
var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;

var replaceFn = function ($inject) {
	return function (all, underscore, name) {
		$inject.push(name);
	};
};

var getFnArgs = function ($inject, fn) {
	
	if (fn.length) {
		var fnText = fn.toString().replace(STRIP_COMMENTS, '');
		var argDecl = fnText.match(FN_ARGS);
		var args = argDecl[1].split(FN_ARG_SPLIT);
		_.forEach(args, function (arg, i) {
			arg.replace(FN_ARG, replaceFn($inject));
		});
	}
};


module.exports = function annotate(fn) {
	var $inject = fn.$inject;

	if (typeof fn === 'function' && !fn.$inject) {
		//Is function
		$inject = [];
		getFnArgs($inject, fn);
	} else if (Array.isArray(fn)) {
		//Is array
		var last = fn.length - 1;
		assert.assertArgFn(fn[last], 'fn');
		$inject = fn.slice(0, last);
	} else {
		//Assert if functoin
		assert.assertArgFn(fn, 'fn', true);
	}

	fn.$inject = $inject;
	return $inject;
}