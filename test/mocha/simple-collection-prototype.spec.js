(function () {
  'use strict';

  var expect = require('chai').expect,
      sinon = require('sinon'),
      utHelpers = require('../lib/unit-test-helpers.js'),
      module = require(utHelpers.getModulePath('simple-collection')),
      GLOBAL_CONFIG = require(utHelpers.getModulePath('global-config')),
      EVENTS = GLOBAL_CONFIG.EVENTS;

  describe('simple-collection', function () {

    xdescribe('prototype methods', function () {

      xdescribe('method()', function () {
        it('stuff', function () {

        });
      });

      xdescribe('method()', function () {
        it('stuff', function () {

        });
      });

      xdescribe('method()', function () {
        it('stuff', function () {

        });
      });
      
    });

  });

})();