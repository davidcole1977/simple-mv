(function () {
  'use strict';

  var expect = require('chai').expect,
      sinon = require('sinon'),
      utHelpers = require('../lib/unit-test-helpers.js'),
      module = require(utHelpers.getModulePath('simple-view')),
      modelSubs = require(utHelpers.getModulePath('model-subscriptions'));

  
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
      var view;

      beforeEach(function () {
        view = view.create();
      });

      xdescribe('method()', function () {
        it('stuff', function () {
        
        });
      });

      xdescribe('bind()', function () {
        it('binds all model data to data parameter if a single argument (model object / id string) is received', function () {
        
        });

        it('binds all model data to a named parameter if two arguments are received (model, parameter name)', function () {
        
        });

        it('binds model datum to a named parameter if three arguments are received (model, datum, parameter name)', function () {
        
        });
      });

     xdescribe('addListener()', function () {
        it('listen to model', function () {
        
        });

        it('listen to model / event', function () {
        
        });

        it('listen to model / datum', function () {
        
        });

        it('listen to model / datum / event', function () {
        
        });
      });

    });

  });

})();
