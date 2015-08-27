(function () {
  'use strict';

  var expect = require('chai').expect,
      sinon = require('sinon'),
      utHelpers = require('../lib/unit-test-helpers.js'),
      module = require(utHelpers.getModulePath('simple-model')),
      sharedCreateSpec = require('../lib/shared-create-spec.js')(module),
      sharedExtendSpec = require('../lib/shared-extend-spec.js')(module),
      modelValidators = require(utHelpers.getModulePath('model-validators')),
      GLOBAL_CONFIG = require(utHelpers.getModulePath('global-config')),
      EVENTS = GLOBAL_CONFIG.EVENTS,
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

      sharedCreateSpec.createdIDsAreDifferent();

      describe('overriding and extending built in parameters / options', function () {

        describe('initialise', function () {
          sharedCreateSpec.initialiseOption();
        });  

        describe('validateOnSet', function () {
          it('prevents values being set() and corresponding events being published if validation fails when set to true', function () {
            var model = module.create({
              validationOnSet: true
            });

            model.assignValidator('foo', 'isString');
            model.set('foo', 'bar');
            expect(model.set.bind(model, 'foo', 999)).to.throw(Error);
            expect(model.get('foo')).to.equal('bar');
          });

          it('allows values to be set() and corresponding events to be published if validation fails when set to false', function () {
            var model = module.create({
              validationOnSet: false
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

        xdescribe('validateOnSave', function () {
          it('stuff', function () {});
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
          it('overrides built in validatorsMap', function () {
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

        describe('saver', function () {
          sharedCreateSpec.saverOption();
        });

        describe('fetcher', function () {
          sharedCreateSpec.fetcherOption();
        });

        describe('custom parameters', function () {
          sharedCreateSpec.customParameters();
        });

        describe('validate options input', function () {
          xit('stuff', function () {

          });

          sharedCreateSpec.validateOptionsInput();
        });  

      });
    });

    describe('extend()', function () {
      sharedExtendSpec.generalTests();
      sharedExtendSpec.optionsInputValidation();
    });

  });

})();
