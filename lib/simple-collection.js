'use strict';

var sh = require('./simple-helpers'),
    _ = require('lodash'),
    modelSubsLists = require('./model-subscriptions'),
    GLOBAL_CONFIG = require('./global-config'),
    EVENT_TYPES = GLOBAL_CONFIG.EVENT_TYPES,
    collectionPrototype,
    defaultOptions;

function unsubscribe (subscription) {
  subscription.unsubscribe();
}

collectionPrototype = {
  emitCollectionEvent: function emitCollectionEvent(keypath, eventType) {
    var publishParams = {
          // TBC
        };

    this.subsList.publish(eventType, publishParams);
    // this.subsList.publish(eventType + ':' + keypath, publishParams);
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
  models: [],
  saver: null,
  fetcher: null
};

function create (options) {
  var newCollection;

  options = (typeof options === 'object') ? options : {};

  newCollection = Object.create(collectionPrototype);
  newCollection.id = _.uniqueId('collection_');
  newCollection.subsList = modelSubsLists.create();
  newCollection.selfSubscriptions = {};

  // throw error if attempting to override collectionPrototype member methods
  if (sh.overridesProps(collectionPrototype, options)) {
    throw new Error('create(): Overriding collection prototype parameters is not permitted');
  }

  // assign default options and override with user-specified options
  _.assign(newCollection, _.cloneDeep(defaultOptions), _.cloneDeep(options));

  // optional initialisation function
  if (typeof options.initialise === 'function') {
    options.initialise.call(newCollection);
  }

  return newCollection;
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
