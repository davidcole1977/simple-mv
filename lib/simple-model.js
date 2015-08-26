'use strict';

var sh = require('./simple-helpers'),
    _ = require('lodash'),
    sce = require('./simple-create-extend'),
    simpleEvents = require('./simple-events'),
    simpleServerComms = require('./simple-server-comms'),
    appSubsLists = require('./app-subscriptions'),
    modelValidators = require('./model-validators'),
    GLOBAL_CONFIG = require('./global-config'),
    EVENTS = GLOBAL_CONFIG.EVENTS,
    prototype,
    defaultOptions,
    extend,
    create;

function valuePassesAllValidators (value, validators) {
  return validators.every(function (validatorName) {
    return modelValidators.get(validatorName).isValid(value);
  });
}

prototype = {

  createEventType: EVENTS.MODEL.CREATE,
  
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

    eventType = (typeof this.data[keypath] === 'undefined') ? EVENTS.MODEL.DATUM_CREATE : EVENTS.MODEL.DATUM_UPDATE;
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

    this.emitDatumEvent(keypath, EVENTS.MODEL.DATUM_REMOVE);
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
          target: this,
          eventType: eventType
        };

    this.emitEvent({
      eventType: eventType,
      keypath: keypath,
      publishParams: publishParams
    });
  },

  emitModelEvent: function emitModelEvent (eventType) {
    var publishParams = {
          target: this,
          eventType: eventType
        };

    this.emitEvent({
      eventType: eventType,
      publishParams: publishParams
    });
  }

};

// augment prototype with events and server comms methods
_.assign(prototype, simpleEvents, simpleServerComms);

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
