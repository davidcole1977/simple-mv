(function () {
  'use strict';

  var expect = require('chai').expect,
      sinon = require('sinon'),
      utHelpers = require('../lib/unit-test-helpers.js'),
      module = require(utHelpers.getModulePath('simple-view')),
      appSubsLists = require(utHelpers.getModulePath('./app-subscriptions')),
      GLOBAL_CONFIG = require(utHelpers.getModulePath('global-config')),
      EVENTS = GLOBAL_CONFIG.EVENTS;

  describe('simple-view', function () {

    describe('view events', function () {
      var view, publishSpy;

      beforeEach(function () {
        publishSpy = sinon.spy(appSubsLists, 'publish');
        view = module.create();
      });

      afterEach(function () {
        appSubsLists.publish.restore();
      });

      describe('view create', function () {
        it('pubsub instance receives view create event with expected args when view created', function () {
          var publishParams = {
                target: view,
                eventType: EVENTS.VIEW.CREATE
              },
              topics = [
                EVENTS.VIEW.CREATE,
                EVENTS.VIEW.CREATE + ':' + view.id
              ];

          topics.forEach(function (topic) {
            expect(publishSpy.calledWith(topic, publishParams)).to.be.true;
          });
        });
      });

      xdescribe('view destroy', function () {
        it('stuff', function () {

        });
      });

    });

  });

})();
