(function () {
  'use strict';

  var expect = require('chai').expect,
      sinon = require('sinon'),
      utHelpers = require('../lib/unit-test-helpers.js'),
      module = require(utHelpers.getModulePath('simple-component')),
      sharedCreateSpec = require('../lib/shared-create-spec.js')(module),
      GLOBAL_CONFIG = require(utHelpers.getModulePath('global-config')),
      EVENTS = GLOBAL_CONFIG.EVENTS;

  describe('simple-component', function () {

    describe('create()', function () {

      sharedCreateSpec.createdIDsAreDifferent();

      describe('overriding and extending built in parameters / options', function () {

        describe('initialise', function () {
          sharedCreateSpec.initialiseOption();
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

    xdescribe('extend', function () {
      it('stuff', function () {

      });
    });

  });

})();
