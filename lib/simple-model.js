'use strict';

var sh = require('./simple-helpers'),
    _ = require('lodash'),
    modelValidators = require('./model-validators'),
    modelSubsLists = require('./model-subscriptions'),
    GLOBAL_CONFIG = require('./global-config'),
    EVENT_TYPES = GLOBAL_CONFIG.EVENT_TYPES,
    model;

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
    var eventType;
    
    if ((typeof keypath !== 'string') || (keypath.length === 0)) {
      throw new Error('set(keypath, value) expects two arguments, the first of which (keypath) should be a string');
    } else if (typeof this.validatorsMap[keypath] !== 'undefined' && !valuePassesAllValidators(value, this.validatorsMap[keypath])) {
      throw new Error('set(keypath, value) value failed assigned validation');
    }

    // early out if desired value is same as present value
    if (typeof this.data[keypath] !== 'undefined' && this.data[keypath] === value) {
      return;
    }

    eventType = (typeof this.data[keypath] === 'undefined') ? EVENT_TYPES.DATUM_CREATE : EVENT_TYPES.DATUM_UPDATE;
    this.data[keypath] = (typeof value !== 'undefined') ? _.cloneDeep(value) : null;
    
    this.emitDatumEvent(keypath, eventType);
  },

  get: function get (keypath) {
    if (typeof keypath !== 'string') {
      throw new Error('get(keypath) expects a single string as an argument');
    } else if (!(keypath in this.data)) {
      throw new Error('get(keypath) there is no parameter with the specified keypath');
    }

    return _.cloneDeep(this.data[keypath]);
  },

  remove: function remove (keypath) {
    if (typeof keypath !== 'string') {
      throw new Error('remove(keypath) expects a single string as an argument');
    }
    delete this.data[keypath];

    this.emitDatumEvent(keypath, EVENT_TYPES.DATUM_REMOVE);
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

  emitDatumEvent: function emitDatumEvent(keypath, eventType) {
    var publishParams = {
          keypath: keypath,
          model: this,
          eventType: eventType
        };

    this.subsList.publish(eventType, publishParams);
    this.subsList.publish(eventType + ':' + keypath, publishParams);
  }

};

function create () {
  var newModel;

  newModel = Object.create(model);
  newModel.data = {};
  newModel.validatorsMap = {};
  newModel.id = _.uniqueId('model_');
  newModel.subsList = modelSubsLists.create();

  return newModel;
}

module.exports = {
  create: create
};
