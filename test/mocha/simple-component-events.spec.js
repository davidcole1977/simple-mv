(function () {
  'use strict';

  var expect = require('chai').expect,
      sinon = require('sinon'),
      utHelpers = require('../lib/unit-test-helpers.js'),
      module = require(utHelpers.getModulePath('simple-component')),
      sharedEventsSpec = require('../lib/shared-events-spec.js')(module, 'COMPONENT'),
      appSubsLists = require(utHelpers.getModulePath('./app-subscriptions')),
      GLOBAL_CONFIG = require(utHelpers.getModulePath('global-config')),
      EVENTS = GLOBAL_CONFIG.EVENTS;

  describe('simple-component', function () {

    describe('component events', function () {
      
      sharedEventsSpec.createAndDestroy();

      describe('component-specific events', function () {
        xit('stuff', function () {

        });
      });

    });

  });

})();
