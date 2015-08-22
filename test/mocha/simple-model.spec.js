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
    
    describe('create()', function () {
      xit('stuff', function () {

      });

      it('model created has an ID attribute that is different from the previous model created', function () {
        var model1 = module.create(),
            model2 = module.create();

        expect(model1.id).to.have.length.above(0);
        expect(model1.id).to.not.equal(model2.id);
      });

      describe('overriding and extending built in parameters / options', function () {

        describe('initialise', function () {
          it('function called when model created', function () {
            var initSpy = sinon.spy(),
                model = module.create({
                  initialise: initSpy
                });

            expect(initSpy.calledOnce).to.be.true;
          });  
        });  

        describe('validationFailPreventsSet', function () {
          it('prevents values being set() and corresponding events being published if validation fails when set to true', function () {
            var model = module.create({
              validationFailPreventsSet: true
            });

            model.assignValidator('foo', 'isString');
            model.set('foo', 'bar');
            expect(model.set.bind(model, 'foo', 999)).to.throw(Error);
            expect(model.get('foo')).to.equal('bar');
          });

          it('allows values to be set() and corresponding events to be published if validation fails when set to false', function () {
            var model = module.create({
              validationFailPreventsSet: false
            });

            model.assignValidator('foo', 'isString');
            model.set('foo', 'bar');
            expect(model.set.bind(model, 'foo', 999)).to.not.throw(Error);
            expect(model.get('foo')).to.equal(999);
          });

          it('defaults to true when not explicitly set', function () {
            var model = module.create();

            model.assignValidator('foo', 'isString');
            model.set('foo', 'bar');
            expect(model.set.bind(model, 'foo', 999)).to.throw(Error);
            expect(model.get('foo')).to.equal('bar');
          });
        });

        describe('data', function () {
          it('overrides build in data', function () {
            var dataOption = {
                  foo: 'bar',
                  woo: [1,2,3,4,4]
                },
                model = module.create({
                  data: dataOption
                });

            expect(model.data).to.deep.equal(dataOption);
          });

          it('built in data is empty object if not explicitly set', function () {
            var model = module.create();
            expect(model.data).to.deep.equal({});
          });
        });

        describe('validatorsMap', function () {
          it('overrides build in validatorsMap', function () {
            var validatorsMapOption = {
                  foo: ['validator1', 'validator2', 'validator3'],
                  bar: ['validator1']
                },
                model = module.create({
                  validatorsMap: validatorsMapOption
                });

            expect(model.validatorsMap).to.deep.equal(validatorsMapOption);
          });

          it('built in validatorsMap is empty object if not explicitly set', function () {
            var model = module.create();
            expect(model.validatorsMap).to.deep.equal({});
          });
        });

        describe('custom parameters', function () {
          it('assigns arbitrary custom parameters to model', function () {
            var customParams = {
                  foo: 'boo',
                  cow: [1,2,3,4,5,6,7],
                  faa: function () {}
                },
                model = module.create(customParams);

            expect(model.foo).to.deep.equal(customParams.foo);
            expect(model.cow).to.deep.equal(customParams.cow);
            expect(model.faa).to.deep.equal(customParams.faa);
          });
        });

        xdescribe('validate options input', function () {
          it('stuff', function () {

          });

          it('cannot override key methods and params (eg. get(), set())', function () {

          });
        });  

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

      describe('on', function () {
        var onSpy;

        beforeEach(function () {
          onSpy = sinon.spy();
        });

        it('callback assigned to datum update event is called with expected params', function () {
          var callbackParams = {
            model: model,
            keypath: 'foo',
            eventType: EVENT_TYPES.DATUM_UPDATE
          };

          model.on(EVENT_TYPES.DATUM_UPDATE, onSpy);
          model.set('foo', 'bar');
          model.set('foo', 'woo');
          expect(onSpy.calledOnce).to.be.true;
          expect(onSpy.calledWith()).to.be.true;
        });

        it('callback assigned to named datum update event is called with expected params', function () {
          var callbackParams = {
            model: model,
            keypath: 'foo',
            eventType: EVENT_TYPES.DATUM_UPDATE
          };

          model.on(EVENT_TYPES.DATUM_UPDATE + ':foo', onSpy);
          model.set('foo', 'bar');
          model.set('foo', 'boo');
          model.set('waa', 'baa');
          expect(onSpy.calledOnce).to.be.true;
          expect(onSpy.calledWith(callbackParams)).to.be.true;
        });

        xit('validates arguments', function () {

        });
      });

      xdescribe('off', function () {
        xit('removes all non-namespaced subscribers to a given topic', function () {

        });

        xit('selectively removes only certain subscribers of many to a given topic', function () {

        });

        xit('validates arguments', function () {

        });
      });

    });

    describe('model events', function () {
      var model, publishSpy;

      beforeEach(function () {
        model = module.create();
        publishSpy = sinon.spy(model.subsList, 'publish');
      });

      afterEach(function () {
        model.subsList.publish.restore();
      });

      describe('datum create', function () {
        it('pubsub instance receives datum create event with expected args when datum created using set()', function () {
          var publishParams = {
                keypath: 'foo',
                model: model,
                eventType: EVENT_TYPES.DATUM_CREATE
              };

          model.set('foo', 'bar');

          expect(publishSpy.calledWith(EVENT_TYPES.DATUM_CREATE, publishParams)).to.be.true;
          expect(publishSpy.calledWith(EVENT_TYPES.DATUM_CREATE + ':foo', publishParams)).to.be.true;
        });
      });

      describe('datum set', function () {
        it('pubsub instance receives datum update event with expected args when datum updated using set()', function () {
          var publishParams = {
                keypath: 'foo',
                model: model,
                eventType: EVENT_TYPES.DATUM_UPDATE
              };

          model.set('foo', 'bar');
          model.set('foo', 'boo');

          expect(publishSpy.calledWith(EVENT_TYPES.DATUM_UPDATE, publishParams)).to.be.true;
          expect(publishSpy.calledWith(EVENT_TYPES.DATUM_UPDATE + ':foo', publishParams)).to.be.true;
        });

        it('pubsub instance does not receive update event set() is called with existing value', function () {
          model.set('foo', 'bar');
          model.set('foo', 'bar');

          expect(publishSpy.calledTwice).to.be.true;
        });
      });

      describe('datum remove', function () {
        it('pubsub instance receives datum remove event with expected args when datum updated using remove()', function () {
          var publishParams = {
                keypath: 'foo',
                model: model,
                eventType: EVENT_TYPES.DATUM_REMOVE
              };

          model.set('foo', 'bar');
          model.remove('foo');

          expect(publishSpy.calledWith(EVENT_TYPES.DATUM_REMOVE, publishParams)).to.be.true;
          expect(publishSpy.calledWith(EVENT_TYPES.DATUM_REMOVE + ':foo', publishParams)).to.be.true;
        });
      });

      xdescribe('save-related events?', function () {
        it('stuff', function () {

        });
      });

      xdescribe('fetch-related events?', function () {
        it('stuff', function () {

        });
      });

      xdescribe('ancestor keypath events / publish events when child keypath is updated', function () {
        it('stuff', function () {

        });
      });

      xdescribe('other event types (eg. fail validation, include error details, validation type etc.', function () {
        it('stuff', function () {

        });
      });
    });

  });

})();
