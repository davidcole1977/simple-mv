/*
global
  describe:false,
  it:false,
  xit:false
*/

'use strict';

var expect = require('chai').expect,
    sinon = require('sinon'),
    utHelpers = require('./unit-test-helpers.js');

module.exports = function (module) {

  function generalTests() {

    it('returns an object with a create method', function () {
      var myComponentClass = module.extend({});
      expect(myComponentClass.create).to.be.a('function');
    });

    it('Two models created using a given extend() return object share the same prototype', function () {
      var myComponentClass = module.extend({}),
          myComponentInstance1 = myComponentClass.create(),
          myComponentInstance2 = myComponentClass.create();

      expect(Object.getPrototypeOf(myComponentInstance1)).to.deep.equal(Object.getPrototypeOf(myComponentInstance2));
    });

    it('Two models created using a given extend() return object share the same custom options and override options', function () {
      var saver = function saver () {},
          customOptions = {
            data: {foo: 'bar', woo: 999},
            saver: saver,
            customObj: {stuff: 'bother'},
            customArray: [1,2,3,4,5]
          },
          myComponentClass,
          myComponentInstance1,
          myComponentInstance2;

      myComponentClass = module.extend(customOptions);
      myComponentInstance1 = myComponentClass.create();
      myComponentInstance2 = myComponentClass.create();

      expect(myComponentInstance1.data).to.deep.equal(myComponentInstance2.data);
      expect(myComponentInstance1.saver).to.deep.equal(myComponentInstance2.saver);
      expect(myComponentInstance1.customObj).to.deep.equal(myComponentInstance2.customObj);
      expect(myComponentInstance1.customArray).to.deep.equal(myComponentInstance2.customArray);
    });

    it('Two models created using a given extend() return object each have unique IDs', function () {
      var myComponentClass = module.extend({}),
          myComponentInstance1 = myComponentClass.create(),
          myComponentInstance2 = myComponentClass.create();

      expect(myComponentInstance1.id).to.not.equal(myComponentInstance2.id);
    });

  }

  function optionsInputValidation () {

    it('throws error if first argument is not an object', function () {
      expect(module.extend.bind(null)).to.throw(Error);

      utHelpers.everyThingExceptObject.forEach(function(notAnObject) {
        expect(module.extend.bind(null, notAnObject)).to.throw(Error);
      });
    });

  }

  return {
    generalTests: generalTests,
    optionsInputValidation: optionsInputValidation
  };

};
