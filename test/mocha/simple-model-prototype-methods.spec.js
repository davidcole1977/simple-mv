(function () {
  'use strict';

  var expect = require('chai').expect,
      sinon = require('sinon'),
      utHelpers = require('../lib/unit-test-helpers.js'),
      module = require(utHelpers.getModulePath('simple-model')),
      modelValidators = require(utHelpers.getModulePath('model-validators')),
      GLOBAL_CONFIG = require(utHelpers.getModulePath('global-config')),
      EVENT_TYPES = GLOBAL_CONFIG.EVENT_TYPES,
      isString = function (value) { return typeof value === 'string'; },
      hasLengthOfFour = function (value) { return value.length === 4; },
      hasLengthOfFourMsg = 'the length should be four',
      isStringMsg = 'the value should be a string';

  modelValidators.set({
    name: 'isString',
    isValid: isString,
    message: isStringMsg
  });

  modelValidators.set({
    name: 'hasLengthOfFour',
    isValid: hasLengthOfFour,
    message: hasLengthOfFourMsg
  });

  describe('simple-model', function () {

    describe('prototype methods', function () {
      var model;

      beforeEach(function () {
        model = module.create();
      });

      describe('get()', function () {
        it('gets the value of a simple string data attribute', function () {
          model.data.foo = 'bar';
          expect(model.get('foo')).to.equal('bar');
        });

        it('altering a value after getting it leaves the stored version unaltered', function () {
          var datum;

          model.data.foo = {foo: 'bar'};
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
          expect(model.data.foo).to.equal('bar');
        });

        it('overrides the value of a previously set simple string data attribute', function () {
          model.set('foo', 'bar');
          model.set('foo', 'woo');
          expect(model.data.foo).to.equal('woo');
        });

        it('sets the data attribute value to null if no value argument is received', function () {
          model.set('foo');
          expect(model.data.foo).to.be.null;
        });

        xit('returns without setting the datum value or emitting any update events if the value has not changed', function () {
          
        });

        it('altering the variable originally passed as a value doesn\'t change the stored value', function () {
          var original = {foo: 'bar'};

          model.set('bar', original);
          original.foo = 1000;

          expect(model.get('bar').foo).to.equal('bar');
        });

        it('throws error and doesn\'t alter the stored value if validation fails', function () {
          model.assignValidator('foo', 'isString');
          model.set('foo', 'bar');
          expect(model.set.bind(model, 'foo', 999)).to.throw(Error);
          expect(model.get('foo')).to.equal('bar');
        });

        it('sets deeply nested value by keypath', function () {

        });

        it('sets deeply nested value by keypath, creating intermediate levels of ancestry if necessary', function () {

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

      describe('assignValidator()', function () {
        it('assigns a single validator object to a datum keypath', function () {
          model.assignValidator('foo', 'isString');
          expect(model.validatorsMap.foo).to.deep.equal(['isString']);
        });

        it('assigns multiple validator objects to a datum keypath (separate statements)', function () {
          model.assignValidator('foo', 'isString');
          model.assignValidator('foo', 'hasLengthOfFour');
          expect(model.validatorsMap.foo).to.deep.equal(['isString', 'hasLengthOfFour']);
        });

        xit('assigns multiple validator objects to a datum keypath (second argument is array)', function () {

        });

        xit('throws an error if less than two arguments are received', function () {

        });

        xit('throws an error if first argument isn\'t a string', function () {

        });

        xit('throws an error if datum with specified keypath doesn\'t exist', function () {

        });

        xit('throws an error if the second argument isn\'t a validator-like object', function () {

        });
      });

      xdescribe('removeValidator()', function () {
        it('stuff', function () {

        });
      });

      describe('isValid()', function () {
        it('returns true if value passes validation rule (one validator is set)', function () {
          model.set('foo', 'bar');
          model.assignValidator('foo', 'isString');
          expect(model.isValid('foo')).to.be.true;
        });

        it('returns false if value fails validation rule (one validator is set)', function () {
          model.set('foo', 999);
          model.assignValidator('foo', 'isString');
          expect(model.isValid('foo')).to.be.false;
        });

        it('returns true if value passes all validation rules (multiple valiators are set)', function () {
          model.set('foo', 'baar');
          model.assignValidator('foo', 'hasLengthOfFour');
          model.assignValidator('foo', 'isString');
          expect(model.isValid('foo')).to.be.true;
        });

        it('returns false if value fails one or more validation rules (multiple valiators are set)', function () {
          model.set('foo', 'bar');
          model.assignValidator('foo', 'hasLengthOfFour');
          model.assignValidator('foo', 'isString');
          expect(model.isValid('foo')).to.be.false;
        });

        xit('validates deeply nested value by keypath (success)', function () {

        });

        xit('validates deeply nested value by keypath (failure)', function () {

        });

        xit('validates arguments', function () {

        });
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

      describe('on()', function () {
        var onSpy;

        beforeEach(function () {
          onSpy = sinon.spy();
        });

        it('callback assigned to general datum update event is called with expected params', function () {
          var callbackParams1 = {
                model: model,
                keypath: 'foo',
                eventType: EVENT_TYPES.DATUM_UPDATE
              },
              callbackParams2 = {
                model: model,
                keypath: 'waa',
                eventType: EVENT_TYPES.DATUM_UPDATE
              };

          model.on({
            eventType: EVENT_TYPES.DATUM_UPDATE
          }, onSpy);

          model.set('foo', 'bar');
          model.set('foo', 'woo');
          model.set('waa', 'baa');
          model.set('waa', 'aah');

          expect(onSpy.calledTwice).to.be.true;
          expect(onSpy.calledWith(callbackParams1)).to.be.true;
          expect(onSpy.calledWith(callbackParams2)).to.be.true;
        });

        it('callback assigned to general datum update event with specified namespace is called with expected arguments', function () {
          var callbackParams1 = {
                model: model,
                keypath: 'foo',
                eventType: EVENT_TYPES.DATUM_UPDATE
              },
              callbackParams2 = {
                model: model,
                keypath: 'waa',
                eventType: EVENT_TYPES.DATUM_UPDATE
              };

          model.on({
            eventType: EVENT_TYPES.DATUM_UPDATE,
            nameSpace: 'baasheep'
          }, onSpy);

          model.set('foo', 'bar');
          model.set('foo', 'boo');
          model.set('waa', 'baa');
          model.set('waa', 'aah');

          expect(onSpy.calledTwice).to.be.true;
          expect(onSpy.calledWith(callbackParams1)).to.be.true;
          expect(onSpy.calledWith(callbackParams2)).to.be.true;
        });

        it('callback assigned to named datum update event is called with expected params', function () {
          var callbackParams = {
                model: model,
                keypath: 'foo',
                eventType: EVENT_TYPES.DATUM_UPDATE
              };

          model.on({
            eventType: EVENT_TYPES.DATUM_UPDATE,
            keypath: 'foo'
          }, onSpy);

          model.set('foo', 'bar');
          model.set('foo', 'boo');
          model.set('waa', 'baa');
          model.set('waa', 'aah');
          expect(onSpy.calledOnce).to.be.true;
          expect(onSpy.calledWith(callbackParams)).to.be.true;
        });

        it('callback assigned to named datum update event with specified namespace is called with expected arguments', function () {
          var callbackParams = {
                model: model,
                keypath: 'foo',
                eventType: EVENT_TYPES.DATUM_UPDATE
              };

          model.on({
            eventType: EVENT_TYPES.DATUM_UPDATE,
            keypath: 'foo',
            nameSpace: 'baasheep'
          }, onSpy);

          model.set('foo', 'bar');
          model.set('foo', 'boo');
          model.set('waa', 'baa');
          model.set('waa', 'aah');

          expect(onSpy.calledOnce).to.be.true;
          expect(onSpy.calledWith(callbackParams)).to.be.true;
        });
      });

      describe('off()', function () {
        var onSpy1, onSpy2, onSpy3, onSpy4;

        beforeEach(function () {
          onSpy1 = sinon.spy();
          onSpy2 = sinon.spy();
          onSpy3 = sinon.spy();
          onSpy4 = sinon.spy();
        });

        it('removes all non-namespaced subscribers to a general datum update', function () {
          var options = {
                eventType: EVENT_TYPES.DATUM_UPDATE
              };

          model.on(options, onSpy1);
          model.on(options, onSpy2);
          model.on(options, onSpy3);

          model.off(options);

          model.set('foo', 1);
          model.set('foo', 2);
          model.set('foo', 3);

          expect(onSpy1.callCount).to.equal(0);
          expect(onSpy2.callCount).to.equal(0);
          expect(onSpy3.callCount).to.equal(0);

          expect(model.subscriptions.internal[EVENT_TYPES.DATUM_UPDATE + ':' + model.id].unNameSpaced).to.have.length(0);
        });

        it('removes all non-namespaced subscribers to a specific datum update', function () {
          var options = {
                eventType: EVENT_TYPES.DATUM_UPDATE,
                keypath: 'foo'
              };

          model.on(options, onSpy1);
          model.on(options, onSpy2);
          model.on(options, onSpy3);

          // TODO: THIS ASSERTION DOESN'T BELONG HERE
          expect(model.subscriptions.internal[EVENT_TYPES.DATUM_UPDATE + ':' + model.id + ':foo'].unNameSpaced).to.have.length(3);

          model.off(options);

          model.set('foo', 1);
          model.set('foo', 2);
          model.set('foo', 3);

          expect(onSpy1.callCount).to.equal(0);
          expect(onSpy2.callCount).to.equal(0);
          expect(onSpy3.callCount).to.equal(0);

          expect(model.subscriptions.internal[EVENT_TYPES.DATUM_UPDATE + ':' + model.id + ':foo'].unNameSpaced).to.have.length(0);
        });

        it('selectively removes only subscribers belonging to a given namespace out of many to a general datum update', function () {
          model.on({
            eventType: EVENT_TYPES.DATUM_UPDATE,
            nameSpace: 'myNameSpace'
          }, onSpy1);

          model.on({
            eventType: EVENT_TYPES.DATUM_UPDATE,
            nameSpace: 'myNameSpace'
          }, onSpy2);

          model.on({
            eventType: EVENT_TYPES.DATUM_UPDATE,
            nameSpace: 'myOtherNameSpace'
          }, onSpy3);

          model.on({
            eventType: EVENT_TYPES.DATUM_UPDATE
          }, onSpy4);

          // TODO: THESE ASSERTIONs DON'T BELONG HERE
          expect(model.subscriptions.internal[EVENT_TYPES.DATUM_UPDATE + ':' + model.id].myNameSpace).to.have.length(2);
          expect(model.subscriptions.internal[EVENT_TYPES.DATUM_UPDATE + ':' + model.id].myOtherNameSpace).to.have.length(1);
          expect(model.subscriptions.internal[EVENT_TYPES.DATUM_UPDATE + ':' + model.id].unNameSpaced).to.have.length(1);

          model.off({
            eventType: EVENT_TYPES.DATUM_UPDATE,
            nameSpace: 'myNameSpace'
          });

          model.set('foo', 1);
          model.set('foo', 2);
          model.set('foo', 3);

          expect(onSpy1.callCount).to.equal(0);
          expect(onSpy2.callCount).to.equal(0);
          expect(onSpy3.callCount).to.equal(2);
          expect(onSpy4.callCount).to.equal(2);

          expect(model.subscriptions.internal[EVENT_TYPES.DATUM_UPDATE + ':' + model.id].myNameSpace).to.be.undefined;
          expect(model.subscriptions.internal[EVENT_TYPES.DATUM_UPDATE + ':' + model.id].myOtherNameSpace).to.have.length(1);
          expect(model.subscriptions.internal[EVENT_TYPES.DATUM_UPDATE + ':' + model.id].unNameSpaced).to.have.length(1);
        });

        xit('validates arguments', function () {

        });
      });

      describe('save', function () {
        it('calls saver function specified in arguments', function () {
          var saver = sinon.spy();
          model.save(saver);
          expect(saver.calledOnce).to.be.true;
        });

        it('if no arguments, calls saver option specified as object create / extend option', function () {
          var saver = sinon.spy();
          model = module.create({
            saver: saver
          });

          model.save();
          expect(saver.calledOnce).to.be.true;
        });

        it('if saver specified in arguments and in object create / extend params, calls save argument and not create param', function () {
          var saverOption = sinon.spy(),
              saverArg = sinon.spy();

          model = module.create({
            saver: saverOption
          });

          model.save(saverArg);
          expect(saverArg.calledOnce).to.be.true;
          expect(saverOption.called).to.be.false;
        });

        xit('saver function has this value of model if specified as argument', function () {

        });

        xit('saver function has this value of model if specified as create option', function () {

        });

        xit('if no arguments and no create option, throws error', function () {

        });

        xit('validates arguments', function () {

        });
      });

      describe('fetch', function () {
        it('calls fetcher function specified in arguments', function () {
          var fetcher = sinon.spy();
          model.fetch(fetcher);
          expect(fetcher.calledOnce).to.be.true;
        });

        it('if no arguments, calls fetcher option specified as object create / extend option', function () {
          var fetcher = sinon.spy();
          model = module.create({
            fetcher: fetcher
          });

          model.fetch();
          expect(fetcher.calledOnce).to.be.true;
        });

        it('if fetcher specified in arguments and in object create / extend params, calls fetch argument and not create param', function () {
          var fetcherOption = sinon.spy(),
              fetcherArg = sinon.spy();

          model = module.create({
            fetcher: fetcherOption
          });

          model.fetch(fetcherArg);
          expect(fetcherArg.calledOnce).to.be.true;
          expect(fetcherOption.called).to.be.false;
        });

        xit('fetcher function has this value of model if specified as argument', function () {

        });

        xit('fetcher function has this value of model if specified as create option', function () {

        });

        xit('if no arguments and no create option, throws error', function () {

        });

        xit('validates arguments', function () {

        });
      });

    });

  });

})();
