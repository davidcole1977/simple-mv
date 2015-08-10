'use strict';

var sh = require('./simple-helpers'),
    _ = require('lodash'),
    defaults;

defaults = {
  isValid: function () {
    return true;
  },
  value: null,
  keypath: null
};

function create (options) {
  var newDatum = {};

  options = (typeof options !== 'undefined') ? options : {};
  options.value = (typeof options.value !== 'undefined') ? options.value : defaults.value;
  options.isValid = (typeof options.isValid === 'function') ? options.isValid : defaults.isValid;
  options.keypath = (typeof options.keypath === 'string') ? options.keypath : defaults.keypath;

  newDatum.value = options.value;
  newDatum.isValid = options.isValid;
  newDatum.keypath = options.keypath;

  return newDatum;
}

module.exports = {
  create: create
};