(function () {
  'use strict';

  var expect = require('chai').expect,
      sinon = require('sinon'),
      utHelpers = require('../lib/unit-test-helpers.js'),
      module = require(utHelpers.getModulePath('simple-collection')),
      sharedListenersSpec = require('../lib/shared-listeners-spec.js')(module),
      GLOBAL_CONFIG = require(utHelpers.getModulePath('global-config')),
      EVENTS = GLOBAL_CONFIG.EVENTS;

  describe('simple-collection', function () {

    describe('eventListeners', function () {
      sharedListenersSpec.modelEventListening();
    });

  });

})();
