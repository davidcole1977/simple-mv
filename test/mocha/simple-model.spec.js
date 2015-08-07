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

        it('altering a value after getting it leaves the stored version unaltered', function () {
          var datum;

          model.data.foo = {value: {foo: 'bar'}};
          datum = model.get('foo');
          datum.foo = 999;

          expect(model.get('foo')).to.deep.equal({foo: 'bar'});
        });

        xit('gets deeply nested value by keypath', function () {

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

        it('altering the variable originally passed as a value doesn\'t change the stored value', function () {
          var original = {foo: 'bar'};

          model.set('bar', original);
          original.foo = 1000;

          expect(model.get('bar').foo).to.equal('bar');
        });

        xit('doesn\'t alter the stored value if validation fails', function () {

        });

        xit('sets deeply nested value by keypath', function () {

        });

        xit('sets deeply nested value by keypath, creating intermediate levels of ancestry if necessary', function () {

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

      describe('setValidator()', function () {
        xit('assigns a single validator object to a datum', function () {

        });

        xit('assigns multiple validator objects to a datum', function () {

        });

        xit('throws an error if less than two arguments are received', function () {

        });

        xit('throws an error if first argument isn\'t a string', function () {

        });

        xit('throws an error if datum with specified key doesn\'t exist', function () {

        });

        xit('throws an error if the second argument isn\'t a validator-like object', function () {

        });
      });

      describe('(Datum???) isValid()', function () {
        xit('returns true if value passes validation rule (one validator is set)', function () {

        });

        xit('returns false if value fails validation rule (one validator is set)', function () {

        });

        xit('returns true if value passes all validation rules (multiple valiators are set)', function () {

        });

        xit('returns false if value fails one or more validation rules (multiple valiators are set)', function () {

        });

        // there can be multiple validation rules – forn isValid to return true, all rules have to pass
      });

      describe('getRawData()', function () {
        it('returns a raw Javascript object version of the model data without extras', function () {
          model.set('foo', [1,2,3]);
          model.set('bar', {foo: 'bar', bar: 'foo'});
          model.set('woo', 'shoo');

          expect(model.getRawData()).to.deep.equal({
            'foo': [1,2,3],
            'bar': {foo: 'bar', bar: 'foo'},
            'woo': 'shoo'
          });
        });

        it('altering a value after getting the raw data leaves the stored version unaltered', function () {
          var rawData;

          model.set('foo', [1,2,3]);
          model.set('bar', {foo: 'bar', bar: 'foo'});
          rawData = model.getRawData();
          rawData.foo[0] = 'hoo';
          rawData.bar.foo = 'doo';

          expect(model.get('foo')).to.deep.equal([1,2,3]);
          expect(model.get('bar')).to.deep.equal({foo: 'bar', bar: 'foo'});
        });
      });

      describe('remove()', function () {
        it('deletes a simple string data attribute', function () {
          model.data.foo = {value: 'bar'};
          model.remove('foo');
          expect(model.data.foo).to.be.undefined;
        }); 

        it('throws an error if no arguments are received', function () {
          expect(model.remove.bind(model)).to.throw(Error);
        });

        it('throws an error if the first argument is not a string', function () {
          utHelpers.everyThingExceptString.forEach(function(notAString) {
            expect(model.remove.bind(model, notAString)).to.throw(Error);
          });
        });

        it('fails silently if attribute to be removed does not exist', function () {
          expect(model.remove.bind(model, 'fubar')).to.not.throw(Error);
        });
      });

    });

  });

})();
