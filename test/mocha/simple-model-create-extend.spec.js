(function () {
  'use strict';

  var expect = require('chai').expect,
      sinon = require('sinon'),
      utHelpers = require('../lib/unit-test-helpers.js'),
      module = require(utHelpers.getModulePath('simple-model')),
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

          xit('can be used to set custom parameters on the model', function () {

          });
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
          it('has null value if not explicitly set', function () {
            var model = module.create();
            expect(model.saver).to.equal(null);
          });

          it('overwites built in parameter', function () {
            var saverOption = function () {},
                model = module.create({
                  saver: saverOption
                });

            expect(model.saver).to.equal(saverOption);
          });
        });

        describe('fetcher', function () {
          it('has null value if not explicitly set', function () {
            var model = module.create();
            expect(model.fetcher).to.equal(null);
          });

          it('overwites built in parameter', function () {
            var fetcherOption = function () {},
                model = module.create({
                  fetcher: fetcherOption
                });
                
            expect(model.fetcher).to.equal(fetcherOption);
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

        describe('validate options input', function () {
          var modelPrototype = Object.getPrototypeOf(module.create()),
              protectedParams = Object.keys(modelPrototype);

          function testProtectedParamOverride (paramName) {
            it('throws error if attempts to override protoype param "' + paramName + '"', function () {
              var options = {};
                  options[paramName] = function () {};

              expect(module.create.bind(null, options)).to.throw(Error);
            });
          }

          xit('stuff', function () {

          });

          protectedParams.forEach(testProtectedParamOverride);
        });  

      });
    });

    describe('extend', function () {
      it('returns an object with a create method', function () {
        var myModelClass = module.extend({});
        expect(myModelClass.create).to.be.a('function');
      });

      it('Two models created using a given extend() return object share the same prototype', function () {
        var myModelClass = module.extend({}),
            myModelInstance1 = myModelClass.create(),
            myModelInstance2 = myModelClass.create();

        expect(Object.getPrototypeOf(myModelInstance1)).to.deep.equal(Object.getPrototypeOf(myModelInstance2));
      });

      it('Two models created using a given extend() return object share the same custom options and override options', function () {
        var saver = function saver () {},
            customOptions = {
              data: {foo: 'bar', woo: 999},
              saver: saver,
              customObj: {stuff: 'bother'},
              customArray: [1,2,3,4,5]
            },
            myModelClass,
            myModelInstance1,
            myModelInstance2;

        myModelClass = module.extend(customOptions);
        myModelInstance1 = myModelClass.create();
        myModelInstance2 = myModelClass.create();

        expect(myModelInstance1.data).to.deep.equal(myModelInstance2.data);
        expect(myModelInstance1.saver).to.deep.equal(myModelInstance2.saver);
        expect(myModelInstance1.customObj).to.deep.equal(myModelInstance2.customObj);
        expect(myModelInstance1.customArray).to.deep.equal(myModelInstance2.customArray);
      });

      it('Two models created using a given extend() return object each have unique IDs', function () {
        var myModelClass = module.extend({}),
            myModelInstance1 = myModelClass.create(),
            myModelInstance2 = myModelClass.create();

        expect(myModelInstance1.id).to.not.equal(myModelInstance2.id);
      });

      it('throws error if first argument is not an object', function () {
        expect(module.extend.bind(null)).to.throw(Error);

        utHelpers.everyThingExceptObject.forEach(function(notAnObject) {
          expect(module.extend.bind(null, notAnObject)).to.throw(Error);
        });
      });
    });

  });

})();
