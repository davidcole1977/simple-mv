'use strict';

var sh = require('./simple-helpers'),
    _ = require('lodash'),
    modelValidators = require('./model-validators'),
    modelSubsLists = require('./model-subscriptions'),
    GLOBAL_CONFIG = require('./global-config'),
    EVENT_TYPES = GLOBAL_CONFIG.EVENT_TYPES,
    modelPrototype,
    defaultOptions;

function valuePassesAllValidators (value, validators) {
  return validators.every(function (validatorName) {
    return modelValidators.get(validatorName).isValid(value);
  });
}

function unsubscribe (subscription) {
  subscription.unsubscribe();
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
    if (this.validationFailPreventsSet && typeof this.validatorsMap[keypath] !== 'undefined' && !valuePassesAllValidators(value, this.validatorsMap[keypath])) {
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

  on: function () {
    var topic = arguments[0],
        topicNameSpace = (arguments.length === 2) ? null : arguments[1],
        callback = (arguments.length === 2) ? arguments[1] : arguments[2],
        newSubscription;

    if (typeof this.selfSubscriptions[topic] === 'undefined') {
      this.selfSubscriptions[topic] = {
        unNameSpaced: []
      };
    }

    if (topicNameSpace !== null && typeof this.selfSubscriptions[topic][topicNameSpace] === 'undefined') {
      this.selfSubscriptions[topic][topicNameSpace] = [];
    }

    newSubscription = this.subsList.createSubscription(topic, callback);

    if (topicNameSpace === null) {
      this.selfSubscriptions[topic].unNameSpaced.push(newSubscription);
    } else {
      this.selfSubscriptions[topic][topicNameSpace].push(newSubscription);
    }
  },

  off: function (topic, nameSpace) {
    var subsArray;

    if (typeof nameSpace === 'undefined') {
      subsArray = this.selfSubscriptions[topic].unNameSpaced;
    } else {
      subsArray = this.selfSubscriptions[topic][nameSpace];
    }

    subsArray.forEach(unsubscribe);
    subsArray.splice(0, subsArray.length); // remove all elements from the self subscriptions array
  },

  save: function (saver) {
    if (typeof saver === 'function') {
      saver();
    } else if (typeof this.saver === 'function') {
      this.saver();
    }
  },

  fetch: function (fetcher) {
    if (typeof fetcher === 'function') {
      fetcher();
    } else if (typeof this.fetcher === 'function') {
      this.fetcher();
    }
  }

};

defaultOptions = {
  validatorsMap: {},
  data: {},
  validationFailPreventsSet: true,
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

function extend (options) {
  if (!sh.isAnObject(options)) {
    throw new Error('extend(options) expects a single argument: options {object}');
  }

  return {
    create: create.bind(null, options)
  };
}

module.exports = {
  create: create,
  extend: extend
};
