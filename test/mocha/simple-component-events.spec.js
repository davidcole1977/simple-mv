(function () {
  'use strict';

  var expect = require('chai').expect,
      sinon = require('sinon'),
      utHelpers = require('../lib/unit-test-helpers.js'),
      module = require(utHelpers.getModulePath('simple-component')),
      appSubsLists = require(utHelpers.getModulePath('./app-subscriptions')),
      GLOBAL_CONFIG = require(utHelpers.getModulePath('global-config')),
      EVENTS = GLOBAL_CONFIG.EVENTS;

  describe('simple-component', function () {

    describe('component events', function () {
      var component, publishSpy;

      beforeEach(function () {
        publishSpy = sinon.spy(appSubsLists, 'publish');
        component = module.create();
      });

      afterEach(function () {
        appSubsLists.publish.restore();
      });

      describe('component create', function () {
        it('pubsub instance receives component create event with expected args when component created', function () {
          var publishParams = {
                target: component,
                eventType: EVENTS.COMPONENT.CREATE
              },
              topics = [
                EVENTS.COMPONENT.CREATE,
                EVENTS.COMPONENT.CREATE + ':' + component.id
              ];

          topics.forEach(function (topic) {
            expect(publishSpy.calledWith(topic, publishParams)).to.be.true;
          });
        });
      });

      xdescribe('component destroy', function () {
        it('stuff', function () {

        });
      });

    });

  });

})();
