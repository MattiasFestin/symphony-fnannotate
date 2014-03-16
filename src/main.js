'use strict';

var assert = require('symphony-fnassert');

var FN_ARGS = /^function\s*[^\(]*\(\s*([^\)]*)\)/m;
var FN_ARG_SPLIT = /,/;
var FN_ARG = /^\s*(_?)(\S+?)\1\s*$/;
var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;

//TODO add generic interface for function
var annotate = function annotate(fn) {
	var $inject,
		fnText,
		argDecl,
		last,
		args,
		replaceFn = function (all, underscore, name) {
			$inject.push(name);
		};

	if (typeof fn === 'function') {
		if (!($inject = fn.$inject)) {
			$inject = [];
			if (fn.length) {
				fnText = fn.toString().replace(STRIP_COMMENTS, '');
				argDecl = fnText.match(FN_ARGS);
				args = argDecl[1].split(FN_ARG_SPLIT);
				for (var i = 0, len = args.length; i < len; i++) {
					var arg = args[i];
					arg.replace(FN_ARG, replaceFn);
				}
			}
			fn.$inject = $inject;
		}
	} else if (Array.isArray(fn)) {
		last = fn.length - 1;
		assert.assertArgFn(fn[last], 'fn');
		$inject = fn.slice(0, last);
	} else {
		assert.assertArgFn(fn, 'fn', true);
	}
	return $inject;
};

module.exports = annotate;