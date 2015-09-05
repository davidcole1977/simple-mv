(function () {
  'use strict';

  var expect = require('chai').expect,
      sinon = require('sinon'),
      utHelpers = require('../lib/unit-test-helpers.js'),
      module = require(utHelpers.getModulePath('simple-view')),
      sm = require(utHelpers.getModulePath('simple-model')),
      sharedEventsSpec = require('../lib/shared-events-spec.js')(module, 'VIEW'),
      appSubsLists = require(utHelpers.getModulePath('./app-subscriptions')),
      GLOBAL_CONFIG = require(utHelpers.getModulePath('global-config')),
      EVENTS = GLOBAL_CONFIG.EVENTS;

  describe('simple-view', function () {

    xdescribe('view events', function () {

      it('stuff', function () {

      });

    });

  });

})();
