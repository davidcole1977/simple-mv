(function () {
  'use strict';

  var expect = require('chai').expect,
      sinon = require('sinon'),
      utHelpers = require('../lib/unit-test-helpers.js'),
      module = require(utHelpers.getModulePath('simple-view')),
      appSubs = require(utHelpers.getModulePath('app-subscriptions')),
      sm = require(utHelpers.getModulePath('simple-model')),
      GLOBAL_CONFIG = require(utHelpers.getModulePath('global-config')),
      EVENTS = GLOBAL_CONFIG.EVENTS;

  
  describe('simple-view', function () {

    describe('prototype methods', function () {

      describe('unbindData()', function () {
        var view, model1, model2;

        beforeEach(function () {
          view = module.create();
          model1 = sm.create();
          model2 = sm.create();

          view.bindData({
            target: model1,
            targetDatum: 'foo',
            viewDatum: 'model1.foo'
          });

          view.bindData({
            target: model1,
            targetDatum: 'coo',
            viewDatum: 'model1.coo'
          });

          view.bindData({
            target: model2,
            targetDatum: 'foo',
            viewDatum: 'model2.foo'
          });

          view.bindData({
            target: model2,
            targetDatum: 'coo',
            viewDatum: 'model2.coo'
          });

          view.bindData({
            target: model1,
            viewDatum: 'model1.all'
          });

          view.bindData({
            target: model2,
            viewDatum: 'model2.all'
          });

          model1.set('foo', [1, 2, 3]);
          model1.set('coo', 'ooh');

          model2.set('foo', [4, 5, 6]);
          model2.set('coo', 'boo');
        });

        describe('unbinding all bindings for a given model', function () {
          it('prevents further updates to view data when ANY model data is updated or removed on unbound model', function () {
            view.unbindData({
              target: model1
            });

            model1.set('foo', [7, 8, 9]);
            model1.set('coo', 'shoo!');

            expect(view.data.model1.foo).to.deep.equal([1, 2, 3]);
            expect(view.data.model1.coo).to.equal('ooh');
          });

          it('does not prevent further updates to view data when model data is updated or removed on model still bound', function () {
            view.unbindData({
              target: model1
            });

            model2.set('foo', [7, 8, 9]);
            model2.set('coo', 'shoo!');

            expect(view.data.model2.foo).to.deep.equal([7, 8, 9]);
            expect(view.data.model2.coo).to.equal('shoo!');
          });

          it('removes whole param from the view bindings array parameter for unbound model', function () {
            view.unbindData({
              target: model1
            });

            expect(view.bindings[model1.id]).to.be.undefined;
          });

          it('does not remove param from the view bindings array parameter for model still bound', function () {
            view.unbindData({
              target: model1
            });

            expect(view.bindings[model2.id]).to.not.be.undefined;
          });

          xit('removes binding subscriptions from app subscription list for unbound model', function () {
          
          });

          xit('does not remove any binding subscriptions from app subscription list for model still bound', function () {
          
          });

          xit('does not remove any non-binding subscriptions from app subscription list for unbound model', function () {
          
          });
        });

        describe('unbinding bindings for a given model by model keypath', function () {
          xit('selectively removes only the view.bindings array entries for that keypath, leaving others untouched', function () {

          });

          xit('stuff', function () {

          });
        });

        describe('validate arguments', function () {
          xit('must be passed a model and optionally EITHER model keypath OR view keypath', function () {

          });
        });
        
      }); // describe('unbindData()', function () {

    });

  });

})();
