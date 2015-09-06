/*
global
  xdescribe:false,
  describe:false,
  it:false,
  xit:false,
  beforeEach:false,
  afterEach:false
*/

'use strict';

var expect = require('chai').expect,
    sinon = require('sinon'),
    utHelpers = require('./unit-test-helpers.js');

module.exports = function (module) {

  function createdIDsAreDifferent () {
    it('component created has an ID attribute that is different from the previous component created', function () {
      var component1 = module.create(),
          component2 = module.create();

      expect(component1.id).to.have.length.above(0);
      expect(component1.id).to.not.equal(component2.id);
    });
  }

  function initialiseOption () {
    it('function called when component created', function () {
        var initSpy = sinon.spy(),
          component = module.create({
            initialise: initSpy
          });

      expect(initSpy.calledOnce).to.be.true;
    });  

    it('can be used to set custom parameters on the component', function () {
      var component;

      function init (component) {
        component.myFunc = function () {};
        component.myString = 'myString';
      }

      component = module.create({
        initialise: init
      });

      expect(component.myFunc).to.be.a('function');
      expect(component.myString).to.equal('myString');
    });

    it('can be used to perform custom actions on the component', function () {
      var component;

      function init (component) {
        component.id = 'foobar';
      }

      component = module.create({
        initialise: init
      });

      expect(component.id).to.equal('foobar');
    });
  }

  function saverOption () {
    it('has null value if not explicitly set', function () {
      var component = module.create();
      expect(component.saver).to.equal(null);
    });

    it('overwites built in parameter', function () {
      var saverOption = function () {},
          component = module.create({
            saver: saverOption
          });

      expect(component.saver).to.equal(saverOption);
    });
  }

  function fetcherOption () {
    it('has null value if not explicitly set', function () {
      var component = module.create();
      expect(component.fetcher).to.equal(null);
    });

    it('overwites built in parameter', function () {
      var fetcherOption = function () {},
          component = module.create({
            fetcher: fetcherOption
          });
          
      expect(component.fetcher).to.equal(fetcherOption);
    });
  }

  function customParameters () {
    it('assigns arbitrary custom parameters to component', function () {
      var customParams = {
            foo: 'boo',
            cow: [1,2,3,4,5,6,7],
            faa: function () {}
          },
          component = module.create(customParams);

      expect(component.foo).to.deep.equal(customParams.foo);
      expect(component.cow).to.deep.equal(customParams.cow);
      expect(component.faa).to.deep.equal(customParams.faa);
    });

    it('functions assigned as custom parameters have correct this value', function () {
      var component = module.create({
        myFunc: function () {
          return this.id;
        }
      });

      expect(component.myFunc()).to.equal(component.id);
    });
  }

  function validateOptionsInput () {
    var componentPrototype = Object.getPrototypeOf(module.create()),
        protectedParams = Object.keys(componentPrototype);

    function testProtectedParamOverride (paramName) {
      it('throws error if attempts to override protoype param "' + paramName + '"', function () {
        var options = {};
            options[paramName] = function () {};

        expect(module.create.bind(null, options)).to.throw(Error);
      });
    }

    protectedParams.forEach(testProtectedParamOverride);
  }

  return {
    createdIDsAreDifferent: createdIDsAreDifferent,
    initialiseOption: initialiseOption,
    saverOption: saverOption,
    fetcherOption: fetcherOption,
    customParameters: customParameters,
    validateOptionsInput: validateOptionsInput
  };

};
