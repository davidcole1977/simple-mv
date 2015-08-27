/*
global
  xdescribe:false,
  describe:false,
  it:false,
  xit:false,
  beforeEach:false,
  afterEach:false
*/

'use strict';

var expect = require('chai').expect,
    sinon = require('sinon'),
    utHelpers = require('./unit-test-helpers.js'),
    appSubsLists = require(utHelpers.getModulePath('./app-subscriptions')),
    GLOBAL_CONFIG = require(utHelpers.getModulePath('global-config')),
    EVENTS = GLOBAL_CONFIG.EVENTS;

module.exports = function (module, eventNameSpace) {

  function createAndDestroy () {

    describe('general events', function () {
      var component, publishSpy;

      beforeEach(function () {
        publishSpy = sinon.spy(appSubsLists, 'publish');
        component = module.create();
      });

      afterEach(function () {
        appSubsLists.publish.restore();
      });

      describe('create', function () {

        it('pubsub instance receives component create event with expected args when component created', function () {
          var publishParams = {
                target: component,
                eventType: EVENTS[eventNameSpace].CREATE
              },
              topics = [
                EVENTS[eventNameSpace].CREATE,
                EVENTS[eventNameSpace].CREATE + ':' + component.id
              ];

          topics.forEach(function (topic) {
            expect(publishSpy.calledWith(topic, publishParams)).to.be.true;
          });
        });
      });

      xdescribe('destroy', function () {
        it('stuff', function () {

        });
      });
    });

  }

  return {
    createAndDestroy: createAndDestroy
  };

};
