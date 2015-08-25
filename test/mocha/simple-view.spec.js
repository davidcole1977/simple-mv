(function () {
  'use strict';

  var expect = require('chai').expect,
      sinon = require('sinon'),
      utHelpers = require('../lib/unit-test-helpers.js'),
      module = require(utHelpers.getModulePath('simple-view')),
      modelSubs = require(utHelpers.getModulePath('app-subscriptions')),
      sm = require(utHelpers.getModulePath('simple-model')),
      GLOBAL_CONFIG = require(utHelpers.getModulePath('global-config')),
      EVENT_TYPES = GLOBAL_CONFIG.EVENT_TYPES;

  
  describe('simple-view', function () {
    
    describe('create()', function () {
      xit('stuff', function () {

      });

      it('view created has an ID attribute that is different from the previous view created', function () {
        var view1 = module.create(),
            view2 = module.create();

        expect(view1.id).to.have.length.above(0);
        expect(view1.id).to.not.equal(view2.id);
      });

      describe('options', function () {
        xit('default data', function () {

        });
      });

      describe('custom parameters and methods', function () {

      });
    });

    describe('extend', function () {
      xit('stuff', function () {

      });
    });

    describe('prototype methods', function () {

      xdescribe('method()', function () {
        it('stuff', function () {
        
        });
      });

      describe('bind()', function () {
        var view, model;

        beforeEach(function () {
          view = module.create();
          model = sm.create();
        });

        describe('binding a whole single model to the whole view data parameter', function () {
          it('view data reflects state of model with no data', function () {
            view.bind({model: model});
            expect(view.data).to.deep.equal({});
          });

          it('view data reflects state of model with data', function () {
            model.set('foo', 'boo');
            model.set('bar', 'car');

            view.bind({model: model});

            expect(view.data).to.deep.equal({
              foo: 'boo',
              bar: 'car'
            });
          });

          it('view data updates correspondingly when model data updates', function () {
            model.set('foo', 'boo');
            model.set('bar', 'car');

            view.bind({model: model});

            model.set('foo', 'hoo');
            model.set('bar', 'far');

            expect(view.data).to.deep.equal({
              foo: 'hoo',
              bar: 'far'
            });
          });
        });

        describe('binding a whole model to a named view data parameter', function () {
          it('view data reflects state of model with no data', function () {
            view.bind({
              model: model,
              viewDatum: 'foo'
            });

            expect(view.data.foo).to.deep.equal({});
          });

          it('view data reflects state of model with data', function () {
            model.set('foo', 'boo');
            model.set('bar', 'car');

            view.bind({
              model: model,
              viewDatum: 'woo'
            });

            expect(view.data).to.deep.equal({
              woo: {
                foo: 'boo',
                bar: 'car'
              }
            });
          });

          it('view data updates correspondingly when model data updates', function () {
            model.set('foo', 'boo');
            model.set('bar', 'car');

            view.bind({
              model: model,
              viewDatum: 'woo'
            });

            model.set('foo', 'hoo');
            model.set('bar', 'far');

            expect(view.data).to.deep.equal({
              woo: {
                foo: 'hoo',
                bar: 'far'
              }
            });
          });
        });

        describe('binding a named model datum to the whole view data parameter', function () {
          it('view data reflects state of model with no data', function () {
            view.bind({
              model: model,
              modelDatum: 'foo'
            });

            expect(view.data).to.deep.equal({
              foo: null
            });
          });

          it('view data reflects state of model with data', function () {
            model.set('foo', 'boo');
            model.set('bar', 'car');

            view.bind({
              model: model,
              modelDatum: 'foo'
            });

            expect(view.data).to.deep.equal({
              foo: 'boo'
            });
          });

          it('view data updates correspondingly when model data updates', function () {
            model.set('foo', 'boo');
            model.set('bar', 'car');

            view.bind({
              model: model,
              modelDatum: 'foo'
            });

            model.set('foo', 'hoo');
            model.set('bar', 'far');

            expect(view.data).to.deep.equal({
              foo: 'hoo'
            });
          });
        });

        describe('binding a named model datum to a named view data parameter', function () {
          it('view data reflects state of model with no data', function () {
            view.bind({
              model: model,
              modelDatum: 'foo',
              viewDatum: 'woo'
            });

            expect(view.data).to.deep.equal({
              woo: null
            });
          });

          it('view data reflects state of model with data', function () {
            model.set('foo', 'boo');
            model.set('bar', 'car');

            view.bind({
              model: model,
              modelDatum: 'foo',
              viewDatum: 'woo'
            });

            expect(view.data).to.deep.equal({
              woo: 'boo'
            });
          });

          it('view data updates correspondingly when model data updates', function () {
            model.set('foo', 'boo');
            model.set('bar', 'car');

            view.bind({
              model: model,
              modelDatum: 'foo',
              viewDatum: 'woo'
            });

            model.set('foo', 'hoo');
            model.set('bar', 'far');

            expect(view.data).to.deep.equal({
              woo: 'hoo'
            });
          });
        });

        xdescribe('validate arguments', function () {
          it('stuff', function () {
          
          });
        });
        
      }); // describe('bind()', function () {

      describe('on()', function () {
        it('make sure it works with stuff unique to views and not just models', function () {

        });
      });

      describe('off()', function () {
        it('make sure it works with stuff unique to views and not just models', function () {

        });
      });

      describe('addListener()', function () {
        var view, model, listenerSpy;

        beforeEach(function () {
          view = module.create();
          model = sm.create();
          listenerSpy = sinon.spy();
        });

        it('callback assigned to general datum update event is called with expected params', function () {
          var callbackParams1 = {
                model: model,
                keypath: 'foo',
                eventType: EVENT_TYPES.DATUM_UPDATE
              },
              callbackParams2 = {
                model: model,
                keypath: 'waa',
                eventType: EVENT_TYPES.DATUM_UPDATE
              };

          view.addListener({
            target: model,
            eventType: EVENT_TYPES.DATUM_UPDATE
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
                model: model,
                keypath: 'foo',
                eventType: EVENT_TYPES.DATUM_UPDATE
              },
              callbackParams2 = {
                model: model,
                keypath: 'waa',
                eventType: EVENT_TYPES.DATUM_UPDATE
              };

          view.addListener({
            target: model,
            eventType: EVENT_TYPES.DATUM_UPDATE,
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
                model: model,
                keypath: 'foo',
                eventType: EVENT_TYPES.DATUM_UPDATE
              };

          view.addListener({
            target: model,
            eventType: EVENT_TYPES.DATUM_UPDATE,
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
                model: model,
                keypath: 'foo',
                eventType: EVENT_TYPES.DATUM_UPDATE
              };

          view.addListener({
            target: model,
            eventType: EVENT_TYPES.DATUM_UPDATE,
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

      }); // describe('addListener()', function () {

      describe('removeListener()', function () {
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
                eventType: EVENT_TYPES.DATUM_UPDATE
              };

          view.addListener(options, listenerSpy1);
          view.addListener(options, listenerSpy2);
          view.addListener(options, listenerSpy3);

          // TODO: THIS DOESN'T BELONG HERE - SEPARATE TEST PLEASE!
          expect(view.externalSubscriptions[EVENT_TYPES.DATUM_UPDATE + ':' + model.id].unNameSpaced).to.have.length(3);

          view.removeListener(options);

          model.set('foo', 1);
          model.set('foo', 2);
          model.set('foo', 3);

          expect(listenerSpy1.callCount).to.equal(0);
          expect(listenerSpy2.callCount).to.equal(0);
          expect(listenerSpy3.callCount).to.equal(0);

          expect(view.externalSubscriptions[EVENT_TYPES.DATUM_UPDATE + ':' + model.id].unNameSpaced).to.have.length(0);
        });

        it('removes all non-namespaced subscribers to a specific datum update', function () {
          var options = {
                target: model,
                eventType: EVENT_TYPES.DATUM_UPDATE,
                keypath: 'foo'
              };

          view.addListener(options, listenerSpy1);
          view.addListener(options, listenerSpy2);
          view.addListener(options, listenerSpy3);

          // TODO: THIS ASSERTION DOESN'T BELONG HERE - SEPARATE TEST PLEASE!
          expect(view.externalSubscriptions[EVENT_TYPES.DATUM_UPDATE + ':' + model.id + ':foo'].unNameSpaced).to.have.length(3);

          view.removeListener(options);

          model.set('foo', 1);
          model.set('foo', 2);
          model.set('foo', 3);

          expect(listenerSpy1.callCount).to.equal(0);
          expect(listenerSpy2.callCount).to.equal(0);
          expect(listenerSpy3.callCount).to.equal(0);

          expect(view.externalSubscriptions[EVENT_TYPES.DATUM_UPDATE + ':' + model.id + ':foo'].unNameSpaced).to.have.length(0);
        });

        it('selectively removes only subscribers belonging to a given namespace out of many to a general datum update', function () {
          view.addListener({
            target: model,
            eventType: EVENT_TYPES.DATUM_UPDATE,
            nameSpace: 'myNameSpace'
          }, listenerSpy1);

          view.addListener({
            target: model,
            eventType: EVENT_TYPES.DATUM_UPDATE,
            nameSpace: 'myNameSpace'
          }, listenerSpy2);

          view.addListener({
            target: model,
            eventType: EVENT_TYPES.DATUM_UPDATE,
            nameSpace: 'myOtherNameSpace'
          }, listenerSpy3);

          view.addListener({
            target: model,
            eventType: EVENT_TYPES.DATUM_UPDATE
          }, listenerSpy4);

          // TODO: THESE ASSERTIONs DON'T BELONG HERE
          expect(view.externalSubscriptions[EVENT_TYPES.DATUM_UPDATE + ':' + model.id].myNameSpace).to.have.length(2);
          expect(view.externalSubscriptions[EVENT_TYPES.DATUM_UPDATE + ':' + model.id].myOtherNameSpace).to.have.length(1);
          expect(view.externalSubscriptions[EVENT_TYPES.DATUM_UPDATE + ':' + model.id].unNameSpaced).to.have.length(1);

          view.removeListener({
            target: model,
            eventType: EVENT_TYPES.DATUM_UPDATE,
            nameSpace: 'myNameSpace'
          });

          model.set('foo', 1);
          model.set('foo', 2);
          model.set('foo', 3);

          expect(listenerSpy1.callCount).to.equal(0);
          expect(listenerSpy2.callCount).to.equal(0);
          expect(listenerSpy3.callCount).to.equal(2);
          expect(listenerSpy4.callCount).to.equal(2);

          expect(view.externalSubscriptions[EVENT_TYPES.DATUM_UPDATE + ':' + model.id].myNameSpace).to.be.undefined;
          expect(view.externalSubscriptions[EVENT_TYPES.DATUM_UPDATE + ':' + model.id].myOtherNameSpace).to.have.length(1);
          expect(view.externalSubscriptions[EVENT_TYPES.DATUM_UPDATE + ':' + model.id].unNameSpaced).to.have.length(1);
        });

        xdescribe('validate arguments', function () {
          it('stuff', function () {
          
          });
        });
      });

    });

  });

})();
