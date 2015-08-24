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

      describe('addListener()', function () {
        var view, model, listenerCallbackSpy;

        beforeEach(function () {
          view = module.create();
          model = sm.create();
          model.set('foo', 'bar');
          model.set('bat', 'man');
          listenerCallbackSpy = sinon.spy();
        });

        describe('datum events', function () {
          it('calls assigned callback on datum update event', function () {
            var callbackParams = {
              keypath: 'foo',
              model: model,
              eventType: EVENT_TYPES.DATUM_UPDATE
            };

            view.addListener({
              model: model,
              event: EVENT_TYPES.DATUM_UPDATE
            }, listenerCallbackSpy);

            model.set('foo', 'boo');

            expect(listenerCallbackSpy.calledOnce).to.be.true;
            expect(listenerCallbackSpy.calledWith(callbackParams)).to.be.true;
          });

          it('calls assigned callback on datum remove event', function () {
            var callbackParams = {
              keypath: 'foo',
              model: model,
              eventType: EVENT_TYPES.DATUM_REMOVE
            };

            view.addListener({
              model: model,
              event: EVENT_TYPES.DATUM_REMOVE
            }, listenerCallbackSpy);

            model.remove('foo');

            expect(listenerCallbackSpy.calledOnce).to.be.true;
            expect(listenerCallbackSpy.calledWith(callbackParams)).to.be.true;
          });

          it('calls assigned callback only on specified datum update event – specific datum', function () {
            var callbackParams = {
              keypath: 'foo',
              model: model,
              eventType: EVENT_TYPES.DATUM_UPDATE
            };

            view.addListener({
              model: model,
              event: EVENT_TYPES.DATUM_UPDATE,
              keypath: 'foo'
            }, listenerCallbackSpy);

            model.set('foo', 'boo');
            model.set('bat', 'robin');

            expect(listenerCallbackSpy.calledOnce).to.be.true;
            expect(listenerCallbackSpy.calledWith(callbackParams)).to.be.true;
          });

          it('calls assigned callback only on specified datum remove event – specific datum', function () {
            var callbackParams = {
              keypath: 'foo',
              model: model,
              eventType: EVENT_TYPES.DATUM_REMOVE
            };

            view.addListener({
              model: model,
              event: EVENT_TYPES.DATUM_REMOVE,
              keypath: 'foo'
            }, listenerCallbackSpy);

            model.remove('foo');
            model.remove('bat');

            expect(listenerCallbackSpy.calledOnce).to.be.true;
            expect(listenerCallbackSpy.calledWith(callbackParams)).to.be.true;
          });
        });

        xdescribe('other events', function () {
          it('stuff', function () {
          
          });
        });

        xdescribe('validate arguments', function () {
          it('stuff', function () {
          
          });
        });

      });

    });

  });

})();
