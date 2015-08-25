(function () {
  'use strict';

  var expect = require('chai').expect,
      sinon = require('sinon'),
      utHelpers = require('../lib/unit-test-helpers.js'),
      module = require(utHelpers.getModulePath('simple-model')),
      appSubsLists = require(utHelpers.getModulePath('./app-subscriptions')),
      modelValidators = require(utHelpers.getModulePath('model-validators')),
      GLOBAL_CONFIG = require(utHelpers.getModulePath('global-config')),
      EVENT_TYPES = GLOBAL_CONFIG.EVENT_TYPES,
      isString = function (value) { return typeof value === 'string'; },
      hasLengthOfFour = function (value) { return value.length === 4; },
      hasLengthOfFourMsg = 'the length should be four',
      isStringMsg = 'the value should be a string';

  modelValidators.set({
    name: 'isString',
    isValid: isString,
    message: isStringMsg
  });

  modelValidators.set({
    name: 'hasLengthOfFour',
    isValid: hasLengthOfFour,
    message: hasLengthOfFourMsg
  });

  describe('simple-model', function () {

    describe('model events', function () {
      var model, publishSpy;

      beforeEach(function () {
        model = module.create();
        publishSpy = sinon.spy(appSubsLists, 'publish');
      });

      afterEach(function () {
        appSubsLists.publish.restore();
      });

      describe('datum create', function () {
        it('pubsub instance receives datum create event with expected args when datum created using set()', function () {
          var publishParams = {
                keypath: 'foo',
                model: model,
                eventType: EVENT_TYPES.DATUM_CREATE
              },
              topics = [
                EVENT_TYPES.DATUM_CREATE,
                EVENT_TYPES.DATUM_CREATE + ':' + model.id,
                EVENT_TYPES.DATUM_CREATE + ':' + model.id + ':foo',
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
                model: model,
                eventType: EVENT_TYPES.DATUM_UPDATE
              },
              topics = [
                EVENT_TYPES.DATUM_UPDATE,
                EVENT_TYPES.DATUM_UPDATE + ':' + model.id,
                EVENT_TYPES.DATUM_UPDATE + ':' + model.id + ':foo',
              ];

          model.set('foo', 'bar');
          model.set('foo', 'boo');

          topics.forEach(function (topic) {
            expect(publishSpy.calledWith(topic, publishParams)).to.be.true;
          });
        });

        it('pubsub instance does not receive update event set() is called with existing value', function () {
          model.set('foo', 'bar');
          model.set('foo', 'bar');

          expect(publishSpy.calledThrice).to.be.true;
        });
      });

      describe('datum remove', function () {
        it('pubsub instance receives datum remove event with expected args when datum updated using remove()', function () {
          var publishParams = {
                keypath: 'foo',
                model: model,
                eventType: EVENT_TYPES.DATUM_REMOVE
              },
              topics = [
                EVENT_TYPES.DATUM_REMOVE,
                EVENT_TYPES.DATUM_REMOVE + ':' + model.id,
                EVENT_TYPES.DATUM_REMOVE + ':' + model.id + ':foo',
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

})();
