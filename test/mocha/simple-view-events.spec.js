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

    describe('view events', function () {

      sharedEventsSpec.createAndDestroy();

      xdescribe('view-specific events', function () {
        var view, publishSpy;

        beforeEach(function () {
          publishSpy = sinon.spy(appSubsLists, 'publish');
          view = module.create();
        });

        afterEach(function () {
          appSubsLists.publish.restore();
        });

        describe('bound data create', function () {
          it('pubsub instance receives view create event with expected args when bound data is removed', function () {
            var model = sm.create(),
                topics = [
                  EVENTS.VIEW.BOUND_DATA_CREATE,
                  EVENTS.VIEW.BOUND_DATA_CREATE + ':' + view.id,
                  EVENTS.VIEW.BOUND_DATA_CREATE + ':' + view.id + ':foo',
                ],
                publishParams = {
                  keypath: 'foo',
                  target: view,
                  eventType: EVENTS.VIEW.BOUND_DATA_CREATE
                };

            view.bindData({
              target: model,
              targetDatum: 'foo',
              viewDatum: 'foo'
            });
            model.set('foo', 1); // create datum

            topics.forEach(function (topic) {
              expect(publishSpy.calledWith(topic, publishParams)).to.be.true;
            });
          });
        });

        describe('bound data update', function () {
          it('pubsub instance receives view update event with expected args when bound data is updated', function () {
            var model = sm.create(),
                topics = [
                  EVENTS.VIEW.BOUND_DATA_UPDATE,
                  EVENTS.VIEW.BOUND_DATA_UPDATE + ':' + view.id,
                  EVENTS.VIEW.BOUND_DATA_UPDATE + ':' + view.id + ':foo',
                ],
                publishParams = {
                  keypath: 'foo',
                  target: view,
                  eventType: EVENTS.VIEW.BOUND_DATA_UPDATE
                };

            view.bindData({
              target: model,
              targetDatum: 'foo',
              viewDatum: 'foo'
            });
            model.set('foo', 1); // create datum
            model.set('foo', 2); // update datum

            topics.forEach(function (topic) {
              expect(publishSpy.calledWith(topic, publishParams)).to.be.true;
            });
          });
        });

        describe('bound data remove', function () {
          it('pubsub instance receives view remove event with expected args when bound data is removed', function () {
            var model = sm.create(),
                topics = [
                  EVENTS.VIEW.BOUND_DATA_REMOVE,
                  EVENTS.VIEW.BOUND_DATA_REMOVE + ':' + view.id,
                  EVENTS.VIEW.BOUND_DATA_REMOVE + ':' + view.id + ':foo',
                ],
                publishParams = {
                  keypath: 'foo',
                  target: view,
                  eventType: EVENTS.VIEW.BOUND_DATA_REMOVE
                };

            view.bindData({
              target: model,
              targetDatum: 'foo',
              viewDatum: 'foo'
            });
            model.set('foo', 1); // create datum
            model.remove('foo'); // remove datum

            topics.forEach(function (topic) {
              expect(publishSpy.calledWith(topic, publishParams)).to.be.true;
            });
          });
        });

      });

    });

  });

})();
