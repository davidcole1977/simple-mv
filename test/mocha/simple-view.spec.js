(function () {
  'use strict';

  var expect = require('chai').expect,
      sinon = require('sinon'),
      utHelpers = require('../lib/unit-test-helpers.js'),
      module = require(utHelpers.getModulePath('simple-view')),
      modelSubs = require(utHelpers.getModulePath('model-subscriptions')),
      sm = require(utHelpers.getModulePath('simple-model'));

  
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
        
      });

      xdescribe('addListener()', function () {

        describe('listening to a model', function () {
          it('stuff', function () {
          
          });
        });

        describe('listening to a model by event', function () {
          it('stuff', function () {
          
          });
        });

        describe('listening to a specific datum on a model', function () {
          it('stuff', function () {
          
          });
        });

        describe('listening to a specific datum on a model by event', function () {
          it('stuff', function () {
          
          });
        });

        describe('arguments validation', function () {
          it('stuff', function () {
          
          });
        });
      });

    });

  });

})();
