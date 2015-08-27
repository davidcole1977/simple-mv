(function () {
  'use strict';

  var expect = require('chai').expect,
      sinon = require('sinon'),
      utHelpers = require('../lib/unit-test-helpers.js'),
      module = require(utHelpers.getModulePath('simple-collection')),
      sharedEventsSpec = require('../lib/shared-events-spec.js')(module, 'COLLECTION'),
      appSubsLists = require(utHelpers.getModulePath('./app-subscriptions')),
      GLOBAL_CONFIG = require(utHelpers.getModulePath('global-config')),
      EVENTS = GLOBAL_CONFIG.EVENTS;

  describe('simple-collection', function () {

    describe('collection events', function () {
      
      sharedEventsSpec.createAndDestroy();

      describe('collection-specific events', function () {
        xit('stuff', function () {

        });
      });

    });

  });

})();
