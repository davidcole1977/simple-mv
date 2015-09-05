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

    describe('createFilledArray()', function () {
      var createFilledArray = module.createFilledArray;

      it('creates array [null, null, null, null] when passed args (4, null)', function () {
        expect(createFilledArray(4, null)).to.deep.equal([null, null, null, null]);
      });

      it('creates array [[], [], [], []] when passed args (4, [])', function () {
        expect(createFilledArray(4, [])).to.deep.equal([[], [], [], []]);
      });

      it('creates array ["foo"] when passed args (1, "foo")', function () {
        expect(createFilledArray(1, "foo")).to.deep.equal(["foo"]);
      });
    });

    xdescribe('isValidKeypath()', function () {
      it('stuff', function () {

      });
    });

    xdescribe('getKeypathDescendentPortion()', function () {
      it('stuff', function () {

      });
    });

    describe('keypathIsSameOrDescendent()', function () {
      var keypathIsSameOrDescendent = module.keypathIsSameOrDescendent;

      it('returns true for identical keypaths', function () {
        expect(keypathIsSameOrDescendent('foo.1.bar.2.3', 'foo.1.bar.2.3')).to.be.true;
      });

      it('returns true if keypath2 is descendent of keypath1', function () {
        expect(keypathIsSameOrDescendent('foo.1.bar.2.3', 'foo.1.bar.2.3.woo.1.doo')).to.be.true;
      });

      it('returns true if keypath 1 is "*" (wildcard for whole model)', function () {
        expect(keypathIsSameOrDescendent('*', 'foo.1.bar.2.3')).to.be.true;
      });

      it('returns false if keypath2 is ancestor of keypath1', function () {
        expect(keypathIsSameOrDescendent('foo.1.bar.2.3.woo.1.doo', 'foo.1.bar.2.3')).to.be.false;
      });

      it('returns false if keypath2 and keypath2 share common ancestor, but are otherwise unrelated', function () {
        expect(keypathIsSameOrDescendent('foo.1.bar.2.3', 'foo.1.woo.2.3')).to.be.false;
      });
    });

  });

})();
