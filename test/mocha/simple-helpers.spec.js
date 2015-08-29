(function () {
  'use strict';

  var expect = require('chai').expect,
      sinon = require('sinon'),
      utHelpers = require('../lib/unit-test-helpers.js'),
      module = require(utHelpers.getModulePath('simple-helpers')),

      referenceObj = {
        foo: 'bar',
        woo: 999,
        moo: function () {},
        hoo: {why: 42},
        coo: ['wow', 'bow']
      },
      similarObj = {
        foo: 'argh',
        woo: 100000,
        moo: function () { console.log('woo hoo'); },
        hoo: {my: 'goodness'},
        coo: [1,2,3,4,5,6]
      },
      disSimilarObj = {
        foo: 100000,
        woo: function () { console.log('woo hoo'); },
        moo: {my: 'goodness'},
        hoo: [1,2,3,4,5,6],
        coo: 'argh'
      },
      longerObj = {
        foo: 'argh',
        woo: 100000,
        moo: function () { console.log('woo hoo'); },
        hoo: {my: 'goodness'},
        coo: [1,2,3,4,5,6],
        too: 'boo'
      },
      objWithDifferentKeys = {
        foo: 'argh',
        woo: 100000,
        moo: function () { console.log('woo hoo'); },
        hee: {my: 'goodness'},
        cee: [1,2,3,4,5,6]
      };

  describe('simple-helpers', function () {

    describe('argumentsToArray()', function () {
      var argumentsToArray = module.argumentsToArray;

      it('converts function arguments to an array', function () {
        var testArgs;

        function testFunction () {
          testArgs = arguments;
        }

        testFunction(4, 5, 6);

        expect(argumentsToArray(testArgs)).to.deep.equal([4, 5, 6]);
      });

    });

    describe('objectsAreSimilar()', function () {
      var objectsAreSimilar = module.objectsAreSimilar;

      it('returns true for objects with the same parameter keys and types', function () {
        expect(objectsAreSimilar(referenceObj, similarObj)).to.be.true;
      });

      it ('returns false for objects with the same parameter keys but different types', function () {
        expect(objectsAreSimilar(referenceObj, disSimilarObj)).to.be.false;
      });

      it ('returns false for objects with the same number and types of keys, but some different key names', function () {
        expect(objectsAreSimilar(referenceObj, objWithDifferentKeys)).to.be.false;
      });

      it('returns false for objects with different number of parameters', function () {
        expect(objectsAreSimilar(referenceObj, longerObj)).to.be.false;
      });

      it('returns false if either argument is not an object (number, string, function, array, null)', function () {
         expect(objectsAreSimilar(referenceObj, 'foo')).to.be.false;
         expect(objectsAreSimilar(referenceObj, 123)).to.be.false;
         expect(objectsAreSimilar(function(){}, referenceObj)).to.be.false;
         expect(objectsAreSimilar([1,2,3], referenceObj)).to.be.false;
      });

    });

    describe('isAnObject()', function () {
      var isAnObject = module.isAnObject;

      it('returns true if argument is an object', function () {
        expect(isAnObject({})).to.be.true;
      });

      it('returns false if argument is not an object, including arrays and null', function () {
        utHelpers.everyThingExceptObject.forEach(function(notAnObject) {
          expect(isAnObject(notAnObject)).to.be.false;
        });
      });
    });

    describe('stringContainsOnlyDigits()', function () {
      var stringContainsOnlyDigits = module.stringContainsOnlyDigits,
          testParams = {
            "0": true,
            "123456789": true,
            "1.23": false,
            "1@3": false,
            "12 ": false,
            "ab3": false,
            "12#": false
          };

      Object.keys(testParams).forEach(function (key) {
        it('returns ' + testParams[key] + ' for "' + key + '"', function () {
          expect(stringContainsOnlyDigits(key)).to.equal(testParams[key]);
        });

      });
    });

  });

})();
