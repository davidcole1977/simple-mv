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

  function generalOnOff () {

    describe('on()', function () {
      var onSpy;

      beforeEach(function () {
        onSpy = sinon.spy();
      });

      xit('works', function () {

      });

      xit('callback has expected this value', function () {

      });

      xit('validates arguments', function () {

      });
    });

    describe('off()', function () {
      xit('works', function () {

      });

      xit('validates arguments', function () {

      });
    });

  }

  return {
    generalOnOff: generalOnOff
  };

};
      