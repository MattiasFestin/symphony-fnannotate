'use strict';

var should = require('should');

var annotate = require('../coverage/src/main');

describe('#annotate', function () {
	it('should return $inject array if defined on the function', function () {
		var fn = function (a) {};
		fn.$inject = ['foo'];
		annotate(fn).should.eql(['foo']);
	});

	it('should throw error when given a non-function value', function () {
		(function () {
			annotate(1);
		}).should.throw('Argument \'fn\' is not a function, got number');
	});

	
	describe('#anonymous function', function () {
		it('should handle a function with no params', function () {
			annotate(function () {}).should.eql([]);
		});

		it('should handle a function with one params', function () {
			annotate(function (foo) {}).should.eql(['foo']);
			annotate(function (bar) {}).should.eql(['bar']);
		});

		it('should handle a function with two params', function () {
			annotate(function (foo, bar) {}).should.eql(['foo', 'bar']);
			annotate(function (baz, biz) {}).should.eql(['baz', 'biz']);
		});
	});

	describe('#function expression', function () {
		it('should handle a function with no params', function () {
			var fn1 = function () {};
			annotate(fn1).should.eql([]);
		});

		it('should handle a function with one params', function () {
			var fn1 = function (foo) {};
			var fn2 = function (bar) {};
			annotate(fn1).should.eql(['foo']);
			annotate(fn2).should.eql(['bar']);
		});

		it('should handle a function with two params', function () {
			var fn1 = function (foo, bar) {};
			var fn2 = function (baz, biz) {};
			annotate(fn1).should.eql(['foo', 'bar']);
			annotate(fn2).should.eql(['baz', 'biz']);
		});
	});

	describe('#function decleration', function () {
		it('should handle a function with no params', function () {
			function fn1 () {}
			annotate(fn1).should.eql([]);
		});

		it('should handle a function with one params', function () {
			function fn1 (foo) {}
			function fn2 (bar) {}
			annotate(fn1).should.eql(['foo']);
			annotate(fn2).should.eql(['bar']);
		});

		it('should handle a function with two params', function () {
			function fn1 (foo, bar) {}
			function fn2 (baz, biz) {}
			annotate(fn1).should.eql(['foo', 'bar']);
			annotate(fn2).should.eql(['baz', 'biz']);
		});
	});

	describe('#manually named parameter with array', function () {
		it('should return the first strings in array as param names', function () {
			annotate(['foo', 'bar', 'baz', function (a, b, c) {}]).should.eql(['foo', 'bar', 'baz']);
		});
		it('should throw an error when last param is not a function', function () {
			(function () {
				annotate(['foo', 'bar', 'baz', 1]).should.eql(['foo', 'bar', 'baz']);
			}).should.throw('Argument \'fn\' is not a function, got number');
		});
	});
});