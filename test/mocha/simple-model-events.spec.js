(function () {
  'use strict';

  var expect = require('chai').expect,
      sinon = require('sinon'),
      utHelpers = require('../lib/unit-test-helpers.js'),
      module = require(utHelpers.getModulePath('simple-model')),
      sharedEventsSpec = require('../lib/shared-events-spec.js')(module, 'MODEL'),
      appSubsLists = require(utHelpers.getModulePath('./app-subscriptions')),
      GLOBAL_CONFIG = require(utHelpers.getModulePath('global-config')),
      EVENTS = GLOBAL_CONFIG.EVENTS;

  describe('simple-model', function () {

    describe('model events', function () {

      sharedEventsSpec.createAndDestroy();

      describe('model-specific events', function () {
        var model, publishSpy;

        beforeEach(function () {
          publishSpy = sinon.spy(appSubsLists, 'publish');
          model = module.create();
        });

        afterEach(function () {
          appSubsLists.publish.restore();
        });

        describe('datum create', function () {
          it('pubsub instance receives datum create event with expected args when datum created using set()', function () {
            var publishParams = {
                  keypath: 'foo',
                  target: model,
                  eventType: EVENTS.MODEL.DATUM_CREATE
                },
                topics = [
                  EVENTS.MODEL.DATUM_CREATE,
                  EVENTS.MODEL.DATUM_CREATE + ':' + model.id,
                  EVENTS.MODEL.DATUM_CREATE + ':' + model.id + ':foo',
                ];

            model.set('foo', 'bar');

            topics.forEach(function (topic) {
              expect(publishSpy.calledWith(topic, publishParams)).to.be.true;
            });
          });
        });

        describe('datum set', function () {
          it('pubsub instance receives datum update event with expected args when datum updated using set()', function () {
            var publishParams = {
                  keypath: 'foo',
                  target: model,
                  eventType: EVENTS.MODEL.DATUM_UPDATE
                },
                topics = [
                  EVENTS.MODEL.DATUM_UPDATE,
                  EVENTS.MODEL.DATUM_UPDATE + ':' + model.id,
                  EVENTS.MODEL.DATUM_UPDATE + ':' + model.id + ':foo',
                ];

            model.set('foo', 'bar');
            model.set('foo', 'boo');

            topics.forEach(function (topic) {
              expect(publishSpy.calledWith(topic, publishParams)).to.be.true;
            });
          });

          it('pubsub instance does not receive update event when set() is called with existing value', function () {
            var topics = [
                  EVENTS.MODEL.DATUM_UPDATE,
                  EVENTS.MODEL.DATUM_UPDATE + ':' + model.id,
                  EVENTS.MODEL.DATUM_UPDATE + ':' + model.id + ':foo',
                ];

            model.set('foo', 'bar');
            model.set('foo', 'bar');

            topics.forEach(function (topic) {
              expect(publishSpy.calledWith(topic)).to.be.false;
            });
          });
        });

        describe('datum remove', function () {
          it('pubsub instance receives datum remove event with expected args when datum updated using remove()', function () {
            var publishParams = {
                  keypath: 'foo',
                  target: model,
                  eventType: EVENTS.MODEL.DATUM_REMOVE
                },
                topics = [
                  EVENTS.MODEL.DATUM_REMOVE,
                  EVENTS.MODEL.DATUM_REMOVE + ':' + model.id,
                  EVENTS.MODEL.DATUM_REMOVE + ':' + model.id + ':foo',
                ];

            model.set('foo', 'bar');
            model.remove('foo');

            topics.forEach(function (topic) {
              expect(publishSpy.calledWith(topic, publishParams)).to.be.true;
            });
          });
        });

        xdescribe('save-related events?', function () {
          it('stuff', function () {

          });
        });

        xdescribe('fetch-related events?', function () {
          it('stuff', function () {

          });
        });

        xdescribe('ancestor keypath events / publish events when child keypath is updated', function () {
          it('stuff', function () {

          });
        });

        xdescribe('other event types (eg. fail validation, include error details, validation type etc.', function () {
          it('stuff', function () {

          });
        });
        
      });

      
    });

  });

})();
