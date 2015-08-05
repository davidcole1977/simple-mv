(function () {
  'use strict';

  var expect = require('chai').expect,
      sinon = require('sinon'),
      utHelpers = require('../lib/unit-test-helpers.js'),
      module = require(utHelpers.getModulePath('simple-model'));

  describe('simple-model', function () {
    
    describe('create()', function () {
      xit('stuff', function () {

      });
    });

    describe('extend', function () {
      xit('stuff', function () {

      });
    });

    describe('prototype methods', function () {
      var model;

      beforeEach(function () {
        model = module.create();
      });

      describe('get()', function () {
        it('gets the value of a simple string data attribute', function () {
          model.data.foo = {value: 'bar'};
          expect(model.get('foo')).to.equal('bar');
        });

        it('throws an error if no arguments are received', function () {
          expect(model.get.bind(model)).to.throw(Error);
        });

        it('throws an error if the first argument is not a string', function () {
          utHelpers.everyThingExceptString.forEach(function(notAString) {
            expect(model.get.bind(model, notAString)).to.throw(Error);
          });
        });

        it('throws an error if the first argument is a string with zero length', function () {
          expect(model.get.bind(model, '')).to.throw(Error);
        });

        it('throws an error if the key doesn\'t exist in data', function () {
          expect(model.get.bind(model, 'foo')).to.throw(Error);
        });
      });

      describe('set()', function () {
        it('sets the value of a simple string data attribute', function () {
          model.set('foo', 'bar');
          expect(model.data.foo.value).to.equal('bar');
        });

        it('overrides the value of a previously set simple string data attribute', function () {
          model.set('foo', 'bar');
          model.set('foo', 'woo');
          expect(model.data.foo.value).to.equal('woo');
        });

        it('sets the data attribute value to null if no value argument is received', function () {
          model.set('foo');
          expect(model.data.foo.value).to.be.null;
        });

        it('throws an error if no arguments are received', function () {
          expect(model.set.bind(model)).to.throw(Error);
        });

        it('throws an error if the first argument is not a string', function () {
          utHelpers.everyThingExceptString.forEach(function(notAString) {
            expect(model.set.bind(model, notAString)).to.throw(Error);
          });
        });

        it('throws an error if the first argument is a string with zero length', function () {
          expect(model.set.bind(model, '')).to.throw(Error);
        });
      });

      describe('delete()', function () {
        it('deletes a simple string data attribute', function () {
          model.data.foo = {value: 'bar'};
          model.delete('foo');
          expect(model.data.foo).to.be.undefined;
        }); 

        it('throws an error if no arguments are received', function () {
          expect(model.delete.bind(model)).to.throw(Error);
        });

        it('throws an error if the first argument is not a string', function () {
          utHelpers.everyThingExceptString.forEach(function(notAString) {
            expect(model.delete.bind(model, notAString)).to.throw(Error);
          });
        });

        it('fails silently if attribute to be deleted does not exist', function () {
          expect(model.delete.bind(model, 'fubar')).to.not.throw(Error);
        });
      });

    });

  });

})();
