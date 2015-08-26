(function () {
  'use strict';

  var expect = require('chai').expect,
      sinon = require('sinon'),
      utHelpers = require('../lib/unit-test-helpers.js'),
      module = require(utHelpers.getModulePath('simple-collection')),
      appSubsLists = require(utHelpers.getModulePath('./app-subscriptions')),
      GLOBAL_CONFIG = require(utHelpers.getModulePath('global-config')),
      EVENTS = GLOBAL_CONFIG.EVENTS;

  describe('simple-collection', function () {

    describe('collection events', function () {
      var collection, publishSpy;

      beforeEach(function () {
        publishSpy = sinon.spy(appSubsLists, 'publish');
        collection = module.create();
      });

      afterEach(function () {
        appSubsLists.publish.restore();
      });

      describe('collection create', function () {
        it('pubsub instance receives collection create event with expected args when collection created', function () {
          var publishParams = {
                target: collection,
                eventType: EVENTS.COLLECTION.CREATE
              },
              topics = [
                EVENTS.COLLECTION.CREATE,
                EVENTS.COLLECTION.CREATE + ':' + collection.id
              ];

          topics.forEach(function (topic) {
            expect(publishSpy.calledWith(topic, publishParams)).to.be.true;
          });
        });
      });

      xdescribe('collection destroy', function () {
        it('stuff', function () {

        });
      });

    });

  });

})();
