'use strict';

var sh = require('./simple-helpers'),
    _ = require('lodash'),
    GLOBAL_CONFIG = require('./global-config'),
    sce = require('./simple-create-extend'),
    simpleServerComms = require('./simple-server-comms'),
    modelValidators = require('./model-validators');

var EVENTS = GLOBAL_CONFIG.EVENTS,
    prototype,
    defaultOptions,
    extend,
    create;

function valuePassesAllValidators (value, validators) {
  return validators.every(function (validatorName) {
    return modelValidators.get(validatorName).isValid(value);
  });
}

function getDeep (data, keys, index, callback) {
  var currentValue = data[keys[index]];

  if (typeof currentValue === 'undefined') {
    callback(new Error('getDeep(): value does not exist in data'), null);
  }

  if (index < keys.length - 1) {
    getDeep(currentValue, keys, index + 1, callback);
  } else {
    callback(null, currentValue);
  }
}

prototype = {

  eventNamespace: 'MODEL',

  // NOT PUBLIC API
  setDeep: function setDeep (data, keypath, keys, index, value, callback) {
    var reachedEnd = index === keys.length - 1;

    // if the current datum doesn't exist, create it (empty array or object)
    if (typeof data[keys[index]] === 'undefined' && !reachedEnd) {
      // look ahead: if the next key is a digit then we need to create an array instead of an object
      data[keys[index]] = sh.stringContainsOnlyDigits(keys[index + 1]) ? [] : {};
    }

    if (reachedEnd) {
      if (this.validationOnSet && typeof this.validatorsMap[keypath] !== 'undefined' && !valuePassesAllValidators(value, this.validatorsMap[keypath])) {
        // optional datum value validation: prevents setting and throws error if invalid value provided
        callback(new Error('set() value failed assigned validation'), null);
      } else {
        data[keys[index]] = _.cloneDeep(value);
        callback(null, value);
      }      
    } else {
      this.setDeep(data[keys[index]], keypath, keys, index + 1, value, callback);
    }
  },
  
  set: function set (keypath, value) {
    var eventType, keys, oldValue, datumAlreadyExists;

    value = typeof value === 'undefined' ? null : value;

    try {
      oldValue = this.get(keypath);
      datumAlreadyExists = true;

      // early out if the new value is the same as the current value
      if (typeof oldValue !== 'undefined' && oldValue === value) {
        return;
      }
    } catch (error) {
      oldValue = null; 
      datumAlreadyExists = false;
    }
    
    // validate arguments
    if ((typeof keypath !== 'string') || (keypath.length === 0)) {
      throw new Error('set(keypath, value) expects two arguments, the first of which (keypath) should be a string');
    }

    keys = keypath.split('.');

    this.setDeep(this.data, keypath, keys, 0, value, function afterSetDeep (error) {
      if (error) {
        throw error;
      }
    });

    eventType = (datumAlreadyExists) ? EVENTS.MODEL.DATUM_UPDATE : EVENTS.MODEL.DATUM_CREATE;
    this.emitEvent(eventType, keypath);
  },

  get: function get (keypath) {
    var keys, returnValue, datumExists;

    if (typeof keypath !== 'string') {
      throw new Error('get(keypath) expects a single string as an argument');
    }

    keys = keypath.split('.');
    returnValue;
    datumExists = true;

    getDeep(this.data, keys, 0, function (error, value) {
      if (error) {
        datumExists = false;
      }

      returnValue = value;
    });

    if (!datumExists) {
      throw new Error('get(keypath) specified keypath doesn\'t exist in model data');
    }

    return _.cloneDeep(returnValue);
  },

  remove: function remove (keypath) {
    if (typeof keypath !== 'string') {
      throw new Error('remove(keypath) expects a single string as an argument');
    }
    delete this.data[keypath];

    this.emitEvent(EVENTS.MODEL.DATUM_REMOVE, keypath);
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
  }

};

// augment prototype with server comms methods
_.assign(prototype, simpleServerComms);

// define default options
defaultOptions = {
  type: 'model',
  validatorsMap: {},
  data: {},
  validationOnSet: true,
  validationOnSave: true, // not yet implemented
  saver: null,
  fetcher: null
};

// define create and extend methods
create = sce.create.bind(null, prototype, defaultOptions);
extend = sce.extend.bind(null, create);

module.exports = {
  create: create,
  extend: extend
};
