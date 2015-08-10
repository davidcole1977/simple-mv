'use strict';

var sh = require('./simple-helpers'),
    // sd = require('./simple-datum'),
    _ = require('lodash'),
    modelValidators = require('./model-validators'),
    model;

// model prototype
model = {
  set: function set (key, value) {
    if ((typeof key !== 'string') || (key.length === 0)) {
      throw new Error('set(key, value) expects two arguments, the first of which (key) should be a string');
    }

    // if the datum doesn't already exist, create it
    // if (!this.data[key]) {
    //   this.data[key] = sd.create({
    //     value: _.cloneDeep(value),
    //     keypath: key,
    //     isValid: function () {return true;}
    //   });
    // } else {
    //   this.data[key].value = _.cloneDeep(value);
    // }
    
    this.data[key] = (typeof value !== 'undefined') ? _.cloneDeep(value) : null;
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
    var rawData = {};

    _.forOwn(this.data, function (datum, key) {
      rawData[key] = _.cloneDeep(datum);
    });

    return rawData;
  },

  assignValidator: function assignValidator (keypath, validatorName) {
    if (!this.validatorsMap[keypath]) {
      this.validatorsMap[keypath] = {};
    }

    this.validatorsMap[keypath][validatorName] = modelValidators.get(validatorName);
  },

  isValid: function isValid (keypath) {
    var allRulesAreValid;

    allRulesAreValid = Object.keys(this.validatorsMap[keypath]).every(function (validatorName) {
      return this.validatorsMap[keypath][validatorName].isValid(this.data[keypath]);
    }.bind(this));

    return allRulesAreValid;
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
