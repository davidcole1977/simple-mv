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
    sm = require(utHelpers.getModulePath('./simple-model')),
    GLOBAL_CONFIG = require(utHelpers.getModulePath('global-config')),
    EVENTS = GLOBAL_CONFIG.EVENTS;

module.exports = function (module) {

  function modelEventListening () {

    describe('listenTo()', function () {
      var component, model, listenerSpy;

      beforeEach(function () {
        component = module.create();
        model = sm.create();
        listenerSpy = sinon.spy();
      });

      xit('callback has expected this value', function () {

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

        component.listenTo({
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

        component.listenTo({
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

        component.listenTo({
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

        component.listenTo({
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

      it('callback is called with expected args when deep datum is updated', function () {
        var callbackParams = {
              target: model,
              keypath: 'foo.boo.doo',
              eventType: EVENTS.MODEL.DATUM_UPDATE
            };

        component.listenTo({
          target: model,
          eventType: EVENTS.MODEL.DATUM_UPDATE,
          keypath: 'foo.boo.doo'
        }, listenerSpy);

        model.set('foo.boo.doo', 'bar');
        model.set('foo.boo.doo', 'boo');
        model.set('waa', 'baa');
        model.set('waa', 'aah');

        expect(listenerSpy.calledOnce).to.be.true;
        expect(listenerSpy.calledWith(callbackParams)).to.be.true;
      });

      it('callback is called with expected args when delegate option set and deep datum is updated', function () {
        var callbackParams = {
              target: model,
              keypath: 'foo.boo.doo',
              eventType: EVENTS.MODEL.DATUM_UPDATE
            };

        component.listenTo({
          target: model,
          eventType: EVENTS.MODEL.DATUM_UPDATE,
          keypath: 'foo.boo.doo',
          delegate: true
        }, listenerSpy);

        model.set('foo.boo.doo', 'bar');
        model.set('foo.boo.doo', 'boo');
        model.set('waa', 'baa');
        model.set('waa', 'aah');

        expect(listenerSpy.calledOnce).to.be.true;
        expect(listenerSpy.calledWith(callbackParams)).to.be.true;
      });

      it('callback is called with expected args when delegate option set and descendent of deep datum is updated', function () {
        var callbackParams = {
              target: model,
              keypath: 'foo.boo.doo.hoo.goo',
              eventType: EVENTS.MODEL.DATUM_UPDATE
            };

        component.listenTo({
          target: model,
          eventType: EVENTS.MODEL.DATUM_UPDATE,
          keypath: 'foo.boo.doo',
          delegate: true
        }, listenerSpy);

        model.set('foo.boo.doo.hoo.goo', 'bar');
        model.set('foo.boo.doo.hoo.goo', 'boo');
        model.set('waa', 'baa');
        model.set('waa', 'aah');

        expect(listenerSpy.calledOnce).to.be.true;
        expect(listenerSpy.calledWith(callbackParams)).to.be.true;
      });

      it('callback is not called when delegate option set and ancestor of deep datum is updated', function () {
        component.listenTo({
          target: model,
          eventType: EVENTS.MODEL.DATUM_UPDATE,
          keypath: 'foo.boo.doo',
          delegate: true
        }, listenerSpy);

        model.set('foo.boo', 'bar');
        model.set('foo.boo', 'boo');
        model.set('waa', 'baa');
        model.set('waa', 'aah');

        expect(listenerSpy.called).to.be.false;
      });

      it('callback is not called when delegate option not set and descendent of deep datum is updated', function () {
        component.listenTo({
          target: model,
          eventType: EVENTS.MODEL.DATUM_UPDATE,
          keypath: 'foo.boo.doo'
        }, listenerSpy);

        model.set('foo.boo.doo.hoo.goo', 'bar');
        model.set('foo.boo.doo.hoo.goo', 'boo');
        model.set('waa', 'baa');
        model.set('waa', 'aah');

        expect(listenerSpy.called).to.be.false;
      });

      xdescribe('validate arguments', function () {
        it('stuff', function () {
        
        });
      });

    }); // describe('listenTo()', function () {

    describe('stopListeningTo()', function () {
      var component, model, listenerSpy1, listenerSpy2, listenerSpy3, listenerSpy4;

      beforeEach(function () {
        component = module.create();
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

        component.listenTo(options, listenerSpy1);
        component.listenTo(options, listenerSpy2);
        component.listenTo(options, listenerSpy3);

        // TODO: THIS DOESN'T BELONG HERE - SEPARATE TEST PLEASE!
        expect(component.subscriptions.external[EVENTS.MODEL.DATUM_UPDATE + ':' + model.id].unNameSpaced).to.have.length(3);

        component.stopListeningTo(options);

        model.set('foo', 1);
        model.set('foo', 2);
        model.set('foo', 3);

        expect(listenerSpy1.callCount).to.equal(0);
        expect(listenerSpy2.callCount).to.equal(0);
        expect(listenerSpy3.callCount).to.equal(0);

        expect(component.subscriptions.external[EVENTS.MODEL.DATUM_UPDATE + ':' + model.id].unNameSpaced).to.have.length(0);
      });

      it('removes all non-namespaced subscribers to a specific datum update', function () {
        var options = {
              target: model,
              eventType: EVENTS.MODEL.DATUM_UPDATE,
              keypath: 'foo'
            };

        component.listenTo(options, listenerSpy1);
        component.listenTo(options, listenerSpy2);
        component.listenTo(options, listenerSpy3);

        // TODO: THIS ASSERTION DOESN'T BELONG HERE - SEPARATE TEST PLEASE!
        expect(component.subscriptions.external[EVENTS.MODEL.DATUM_UPDATE + ':' + model.id + ':foo'].unNameSpaced).to.have.length(3);

        component.stopListeningTo(options);

        model.set('foo', 1);
        model.set('foo', 2);
        model.set('foo', 3);

        expect(listenerSpy1.callCount).to.equal(0);
        expect(listenerSpy2.callCount).to.equal(0);
        expect(listenerSpy3.callCount).to.equal(0);

        expect(component.subscriptions.external[EVENTS.MODEL.DATUM_UPDATE + ':' + model.id + ':foo'].unNameSpaced).to.have.length(0);
      });

      it('selectively removes only subscribers belonging to a given namespace out of many to a general datum update', function () {
        component.listenTo({
          target: model,
          eventType: EVENTS.MODEL.DATUM_UPDATE,
          nameSpace: 'myNameSpace'
        }, listenerSpy1);

        component.listenTo({
          target: model,
          eventType: EVENTS.MODEL.DATUM_UPDATE,
          nameSpace: 'myNameSpace'
        }, listenerSpy2);

        component.listenTo({
          target: model,
          eventType: EVENTS.MODEL.DATUM_UPDATE,
          nameSpace: 'myOtherNameSpace'
        }, listenerSpy3);

        component.listenTo({
          target: model,
          eventType: EVENTS.MODEL.DATUM_UPDATE
        }, listenerSpy4);

        // TODO: THESE ASSERTIONs DON'T BELONG HERE
        expect(component.subscriptions.external[EVENTS.MODEL.DATUM_UPDATE + ':' + model.id].myNameSpace).to.have.length(2);
        expect(component.subscriptions.external[EVENTS.MODEL.DATUM_UPDATE + ':' + model.id].myOtherNameSpace).to.have.length(1);
        expect(component.subscriptions.external[EVENTS.MODEL.DATUM_UPDATE + ':' + model.id].unNameSpaced).to.have.length(1);

        component.stopListeningTo({
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

        expect(component.subscriptions.external[EVENTS.MODEL.DATUM_UPDATE + ':' + model.id].myNameSpace).to.be.undefined;
        expect(component.subscriptions.external[EVENTS.MODEL.DATUM_UPDATE + ':' + model.id].myOtherNameSpace).to.have.length(1);
        expect(component.subscriptions.external[EVENTS.MODEL.DATUM_UPDATE + ':' + model.id].unNameSpaced).to.have.length(1);
      });

      xit('removes the entire topic from subscribers array when no subscriptions to that topic remain', function () {

      });

      xdescribe('validate arguments', function () {
        it('stuff', function () {
        
        });
      });
    });

  }

  return {
    modelEventListening: modelEventListening
  };

};
