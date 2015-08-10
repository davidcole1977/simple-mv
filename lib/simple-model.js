'use strict';

var sh = require('./simple-helpers'),
    // sd = require('./simple-datum'),
    _ = require('lodash'),
    modelValidators = require('./model-validators'),
    model;

// helpers
function valuePassesAllValidators (value, validators) {
  var allRulesAreValid;

  allRulesAreValid = Object.keys(validators).every(function (validatorName) {
    return validators[validatorName].isValid(value);
  });

  return allRulesAreValid;
}

// model prototype
model = {
  set: function set (keypath, value) {
    if ((typeof keypath !== 'string') || (keypath.length === 0)) {
      throw new Error('set(keypath, value) expects two arguments, the first of which (keypath) should be a string');
    } else if (typeof this.validatorsMap[keypath] !== 'undefined' && !valuePassesAllValidators(value, this.validatorsMap[keypath])) {
      throw new Error('set(keypath, value) value failed assigned validation');
    }
    
    this.data[keypath] = (typeof value !== 'undefined') ? _.cloneDeep(value) : null;
  },

  get: function get (key) {
    if (typeof key !== 'string') {
      throw new Error('get(key) expects a single string as an argument');
    } else if (!(key in this.data)) {
      throw new Error('get(key) there is no parameter with the specified key');
    }

    return _.cloneDeep(this.data[key]);
  },

  remove: function remove (key) {
    if (typeof key !== 'string') {
      throw new Error('delete(key) expects a single string as an argument');
    }
    delete this.data[key];
  },

  getRawData: function getRawData () {
    return _.cloneDeep(this.data);
  },

  assignValidator: function assignValidator (keypath, validatorName) {
    if (!this.validatorsMap[keypath]) {
      this.validatorsMap[keypath] = {};
    }

    this.validatorsMap[keypath][validatorName] = modelValidators.get(validatorName);
  },

  isValid: function isValid (keypath) {
    return valuePassesAllValidators(this.get(keypath), this.validatorsMap[keypath]);
  },

  emitDatumEvent: function emitDatumEvent (keypath, eventType) {
    // event type: create datum, change value, fail validation
    // send keypath, value, validation details, event type
  }
};

function create () {
  var newModel;

  newModel = Object.create(model);
  newModel.data = {};
  newModel.validatorsMap = {};

  return newModel;
}

module.exports = {
  create: create
};
