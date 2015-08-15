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

    xdescribe('getModel', function () {
      it('retrieves model by ID string', function () {

      });

      it('retrieves model by object reference', function () {

      });

      it('validates arguments', function () {

      });
    });

    describe('prototype methods', function () {
      var view, model;

      beforeEach(function () {
        view = module.create();
        model = sm.create();
      });

      xdescribe('method()', function () {
        it('stuff', function () {
        
        });
      });

      xdescribe('bind()', function () {

        describe('binding a whole single model to the view data (one argument: model object / ID string)', function () {
          it('view data reflects state of model with no data', function () {
            view.bind(model);

            expect(view.data).to.deep.equal({});
          });

          it('view data reflects state of model with data', function () {
            model.set('foo', 'boo');
            model.set('bar', 'car');

            view.bind(model);

            expect(view.data).to.deep.equal({
              foo: 'boo',
              bar: 'car'
            });
          });

          it('binds by model id string instead of model object reference', function () {
            model.set('foo', 'boo');
            model.set('bar', 'car');

            view.bind(model.id);

            expect(view.data).to.deep.equal({
              foo: 'boo',
              bar: 'car'
            });
          });

          it('view data updates correspondingly when model data updates', function () {
            model.set('foo', 'boo');
            model.set('bar', 'car');

            view.bind(model);

            model.set('foo', 'hoo');
            model.set('bar', 'far');

            expect(view.data).to.deep.equal({
              foo: 'hoo',
              bar: 'far'
            });
          });
        });

        xdescribe('binding a whole model to a named view data parameter (two arguments: model, parameter name) ', function () {
          it('stuff', function () {
          
          });
        });

        // it('binds all model data to a named parameter if two arguments are received (model, parameter name)', function () {
        
        // });

        xdescribe('binding a model datum to a named view data parameter (three arguments: model, datum, parameter namee) ', function () {
          it('stuff', function () {
          
          });
        });

        xdescribe('validate arguments', function () {
          it('stuff', function () {
          
          });
        });

        // it('binds model datum to a named parameter if three arguments are received (model, datum, parameter name)', function () {
        
        // });

        

        
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
