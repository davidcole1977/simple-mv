'use strict';

var sh = require('./simple-helpers'),
    _ = require('lodash'),
    spm = require('./simple-prototype-methods'),
    modelValidators = require('./model-validators'),
    modelSubsLists = require('./model-subscriptions'),
    GLOBAL_CONFIG = require('./global-config'),
    EVENT_TYPES = GLOBAL_CONFIG.EVENT_TYPES,
    modelPrototype,
    defaultOptions,
    extend;

function valuePassesAllValidators (value, validators) {
  return validators.every(function (validatorName) {
    return modelValidators.get(validatorName).isValid(value);
  });
}

modelPrototype = {
  set: function set (keypath, value) {
    var eventType;
    
    // validate arguments
    if ((typeof keypath !== 'string') || (keypath.length === 0)) {
      throw new Error('set(keypath, value) expects two arguments, the first of which (keypath) should be a string');
    }

    // early out if desired value is same as present value
    if (typeof this.data[keypath] !== 'undefined' && this.data[keypath] === value) {
      return;
    }

    // optional datum value validation: prevents setting and throws error if invalid value provided
    if (this.validationOnSet && typeof this.validatorsMap[keypath] !== 'undefined' && !valuePassesAllValidators(value, this.validatorsMap[keypath])) {
      throw new Error('set(keypath, value) value failed assigned validation');
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
      this.validatorsMap[keypath] = [];
    }

    if (this.validatorsMap[keypath].indexOf(validatorName) === -1) {
      this.validatorsMap[keypath].push(validatorName);
    }
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
  },

  emitModelEvent: function emitModelEvent () {
    
  }

};

defaultOptions = {
  validatorsMap: {},
  data: {},
  validationOnSet: true,
  validationOnSave: true, // not yet implemented
  saver: null,
  fetcher: null
};

function create (options) {
  var newModel;

  options = (typeof options === 'object') ? options : {};

  newModel = Object.create(modelPrototype);
  newModel.id = _.uniqueId('model_');
  newModel.subsList = modelSubsLists.create();
  newModel.selfSubscriptions = {};

  // common shared 'prototype' methods
  newModel.on = spm.on.bind(newModel);
  newModel.off = spm.off.bind(newModel);
  newModel.fetch = spm.fetch.bind(newModel);
  newModel.save = spm.save.bind(newModel);

  // throw error if attempting to override modelPrototype member methods
  if (sh.overridesProps(modelPrototype, options)) {
    throw new Error('create(): Overriding model prototype parameters is not permitted');
  }

  // assign default options and override with user-specified options
  _.assign(newModel, _.cloneDeep(defaultOptions), _.cloneDeep(options));

  // optional initialisation function
  if (typeof options.initialise === 'function') {
    options.initialise.call(newModel);
  }

  return newModel;
}

extend = spm.extend.bind(null, create);

module.exports = {
  create: create,
  extend: extend
};
