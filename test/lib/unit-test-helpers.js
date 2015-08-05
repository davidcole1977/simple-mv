'use strict';

module.exports = {

  everyType: [
    '',
    123,
    {},
    null,
    [],
    function () {}
  ],

  everyThingExceptString: [
    123,
    {},
    null,
    [],
    function () {}
  ],

  everyThingExceptFunction: [
    123,
    'foo',
    {},
    null,
    []
  ],

  everyThingExceptObject: [
    123,
    'foo',
    null,
    [],
    function () {}
  ],

  everyThingExceptArray: [
    123,
    'foo',
    null,
    {},
    function () {}
  ],

  getModulePath: function (moduleName) {
    var libDir = process.env.LIB_DIR || 'lib/';
    
    return libDir + moduleName;
  }

};