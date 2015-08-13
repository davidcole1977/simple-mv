'use strict';

var sh = require('./simple-helpers'),
    _ = require('lodash'),
    modelValidators = require('./model-validators'),
    modelSubs = require('./model-subscriptions'),
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

    eventType = (typeof this.data[keypath] === 'undefined') ? EVENT_TYPES.DATUM_CREATE : EVENT_TYPES.DATUM_UPDATE;
    this.data[keypath] = (typeof value !== 'undefined') ? _.cloneDeep(value) : null;

    this.emitDatumEvent(keypath, eventType);
    this.emitModelEvent(keypath, EVENT_TYPES.MODEL_UPDATE);
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

  emitModelEvent: function emitModelEvent(keypath, eventType) {
    var topicName = this.id + ':' + eventType,
        publishParams = {
          keypath: keypath,
          model: this
        };

    modelSubs.publish(topicName, publishParams);
  },

  emitDatumEvent: function emitDatumEvent(keypath, eventType) {
    var topicName = this.id + ':' + keypath + ':' + eventType,
        publishParams = {
          value: this.data[keypath],
          parentModel: this
        };

    modelSubs.publish(topicName, publishParams);


    // event type: create datum, change value, fail validation
    // send keypath, value, validation details, event type
  }
};

function create () {
  var newModel;

  newModel = Object.create(model);
  newModel.data = {};
  newModel.validatorsMap = {};
  newModel.id = _.uniqueId('model_');

  return newModel;
}

module.exports = {
  create: create
};
