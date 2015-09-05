(function () {
  'use strict';

  var expect = require('chai').expect,
      sinon = require('sinon'),
      utHelpers = require('../lib/unit-test-helpers.js'),
      module = require(utHelpers.getModulePath('simple-view')),
      modelSubs = require(utHelpers.getModulePath('app-subscriptions')),
      sm = require(utHelpers.getModulePath('simple-model')),
      GLOBAL_CONFIG = require(utHelpers.getModulePath('global-config')),
      EVENTS = GLOBAL_CONFIG.EVENTS;

  
  describe('simple-view', function () {

    describe('prototype methods', function () {

      xdescribe('method()', function () {
        it('stuff', function () {
        
        });
      });

      describe('on()', function () {
        it('make sure it works with stuff unique to views and not just models', function () {

        });
      });

      describe('off()', function () {
        it('make sure it works with stuff unique to views and not just models', function () {

        });
      });

      describe('listenTo()', function () {
        var view, model, listenerSpy;

        beforeEach(function () {
          view = module.create();
          model = sm.create();
          listenerSpy = sinon.spy();
        });

        it('callback assigned to general datum update event is called with expected params', function () {
          var callbackParams1 = {
                target: model,
                keypath: 'foo',
                eventType: EVENTS.MODEL.DATUM_UPDATE
              },
              callbackParams2 = {
                target: model,
                keypath: 'waa',
                eventType: EVENTS.MODEL.DATUM_UPDATE
              };

          view.listenTo({
            target: model,
            eventType: EVENTS.MODEL.DATUM_UPDATE
          }, listenerSpy);

          model.set('foo', 'bar');
          model.set('foo', 'woo');
          model.set('waa', 'baa');
          model.set('waa', 'aah');

          expect(listenerSpy.calledTwice).to.be.true;
          expect(listenerSpy.calledWith(callbackParams1)).to.be.true;
          expect(listenerSpy.calledWith(callbackParams2)).to.be.true;
        });

        it('callback assigned to general datum update event with specified namespace is called with expected arguments', function () {
          var callbackParams1 = {
                target: model,
                keypath: 'foo',
                eventType: EVENTS.MODEL.DATUM_UPDATE
              },
              callbackParams2 = {
                target: model,
                keypath: 'waa',
                eventType: EVENTS.MODEL.DATUM_UPDATE
              };

          view.listenTo({
            target: model,
            eventType: EVENTS.MODEL.DATUM_UPDATE,
            nameSpace: 'baasheep'
          }, listenerSpy);

          model.set('foo', 'bar');
          model.set('foo', 'boo');
          model.set('waa', 'baa');
          model.set('waa', 'aah');

          expect(listenerSpy.calledTwice).to.be.true;
          expect(listenerSpy.calledWith(callbackParams1)).to.be.true;
          expect(listenerSpy.calledWith(callbackParams2)).to.be.true;
        });

        it('callback assigned to named datum update event is called with expected params', function () {
          var callbackParams = {
                target: model,
                keypath: 'foo',
                eventType: EVENTS.MODEL.DATUM_UPDATE
              };

          view.listenTo({
            target: model,
            eventType: EVENTS.MODEL.DATUM_UPDATE,
            keypath: 'foo',
          }, listenerSpy);

          model.set('foo', 'bar');
          model.set('foo', 'boo');
          model.set('waa', 'baa');
          model.set('waa', 'aah');

          expect(listenerSpy.calledOnce).to.be.true;
          expect(listenerSpy.calledWith(callbackParams)).to.be.true;
        });

        it('callback assigned to named datum update event with specified namespace is called with expected arguments', function () {
          var callbackParams = {
                target: model,
                keypath: 'foo',
                eventType: EVENTS.MODEL.DATUM_UPDATE
              };

          view.listenTo({
            target: model,
            eventType: EVENTS.MODEL.DATUM_UPDATE,
            keypath: 'foo',
            nameSpace: 'baasheep'
          }, listenerSpy);

          model.set('foo', 'bar');
          model.set('foo', 'boo');
          model.set('waa', 'baa');
          model.set('waa', 'aah');

          expect(listenerSpy.calledOnce).to.be.true;
          expect(listenerSpy.calledWith(callbackParams)).to.be.true;
        });

        xdescribe('validate arguments', function () {
          it('stuff', function () {
          
          });
        });

      }); // describe('listenTo()', function () {

      describe('stopListeningTo()', function () {
        var view, model, listenerSpy1, listenerSpy2, listenerSpy3, listenerSpy4;

        beforeEach(function () {
          view = module.create();
          model = sm.create();
          listenerSpy1 = sinon.spy();
          listenerSpy2 = sinon.spy();
          listenerSpy3 = sinon.spy();
          listenerSpy4 = sinon.spy();
        });

        it('removes all non-namespaced subscribers to a general datum update', function () {
          var options = {
                target: model,
                eventType: EVENTS.MODEL.DATUM_UPDATE
              };

          view.listenTo(options, listenerSpy1);
          view.listenTo(options, listenerSpy2);
          view.listenTo(options, listenerSpy3);

          // TODO: THIS DOESN'T BELONG HERE - SEPARATE TEST PLEASE!
          expect(view.subscriptions.external[EVENTS.MODEL.DATUM_UPDATE + ':' + model.id].unNameSpaced).to.have.length(3);

          view.stopListeningTo(options);

          model.set('foo', 1);
          model.set('foo', 2);
          model.set('foo', 3);

          expect(listenerSpy1.callCount).to.equal(0);
          expect(listenerSpy2.callCount).to.equal(0);
          expect(listenerSpy3.callCount).to.equal(0);

          expect(view.subscriptions.external[EVENTS.MODEL.DATUM_UPDATE + ':' + model.id].unNameSpaced).to.have.length(0);
        });

        it('removes all non-namespaced subscribers to a specific datum update', function () {
          var options = {
                target: model,
                eventType: EVENTS.MODEL.DATUM_UPDATE,
                keypath: 'foo'
              };

          view.listenTo(options, listenerSpy1);
          view.listenTo(options, listenerSpy2);
          view.listenTo(options, listenerSpy3);

          // TODO: THIS ASSERTION DOESN'T BELONG HERE - SEPARATE TEST PLEASE!
          expect(view.subscriptions.external[EVENTS.MODEL.DATUM_UPDATE + ':' + model.id + ':foo'].unNameSpaced).to.have.length(3);

          view.stopListeningTo(options);

          model.set('foo', 1);
          model.set('foo', 2);
          model.set('foo', 3);

          expect(listenerSpy1.callCount).to.equal(0);
          expect(listenerSpy2.callCount).to.equal(0);
          expect(listenerSpy3.callCount).to.equal(0);

          expect(view.subscriptions.external[EVENTS.MODEL.DATUM_UPDATE + ':' + model.id + ':foo'].unNameSpaced).to.have.length(0);
        });

        it('selectively removes only subscribers belonging to a given namespace out of many to a general datum update', function () {
          view.listenTo({
            target: model,
            eventType: EVENTS.MODEL.DATUM_UPDATE,
            nameSpace: 'myNameSpace'
          }, listenerSpy1);

          view.listenTo({
            target: model,
            eventType: EVENTS.MODEL.DATUM_UPDATE,
            nameSpace: 'myNameSpace'
          }, listenerSpy2);

          view.listenTo({
            target: model,
            eventType: EVENTS.MODEL.DATUM_UPDATE,
            nameSpace: 'myOtherNameSpace'
          }, listenerSpy3);

          view.listenTo({
            target: model,
            eventType: EVENTS.MODEL.DATUM_UPDATE
          }, listenerSpy4);

          // TODO: THESE ASSERTIONs DON'T BELONG HERE
          expect(view.subscriptions.external[EVENTS.MODEL.DATUM_UPDATE + ':' + model.id].myNameSpace).to.have.length(2);
          expect(view.subscriptions.external[EVENTS.MODEL.DATUM_UPDATE + ':' + model.id].myOtherNameSpace).to.have.length(1);
          expect(view.subscriptions.external[EVENTS.MODEL.DATUM_UPDATE + ':' + model.id].unNameSpaced).to.have.length(1);

          view.stopListeningTo({
            target: model,
            eventType: EVENTS.MODEL.DATUM_UPDATE,
            nameSpace: 'myNameSpace'
          });

          model.set('foo', 1);
          model.set('foo', 2);
          model.set('foo', 3);

          expect(listenerSpy1.callCount).to.equal(0);
          expect(listenerSpy2.callCount).to.equal(0);
          expect(listenerSpy3.callCount).to.equal(2);
          expect(listenerSpy4.callCount).to.equal(2);

          expect(view.subscriptions.external[EVENTS.MODEL.DATUM_UPDATE + ':' + model.id].myNameSpace).to.be.undefined;
          expect(view.subscriptions.external[EVENTS.MODEL.DATUM_UPDATE + ':' + model.id].myOtherNameSpace).to.have.length(1);
          expect(view.subscriptions.external[EVENTS.MODEL.DATUM_UPDATE + ':' + model.id].unNameSpaced).to.have.length(1);
        });

        xdescribe('validate arguments', function () {
          it('stuff', function () {
          
          });
        });
      });

    });

  });

})();
