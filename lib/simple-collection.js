'use strict';

var sh = require('./simple-helpers'),
    _ = require('lodash'),
    spm = require('./simple-prototype-methods'),
    modelSubsLists = require('./model-subscriptions'),
    GLOBAL_CONFIG = require('./global-config'),
    EVENT_TYPES = GLOBAL_CONFIG.EVENT_TYPES,
    collectionPrototype,
    defaultOptions,
    extend;

collectionPrototype = {
  emitCollectionEvent: function emitCollectionEvent(keypath, eventType) {
    var publishParams = {
          // TBC
        };

    this.subsList.publish(eventType, publishParams);
    // this.subsList.publish(eventType + ':' + keypath, publishParams);
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

  // common shared 'prototype' methods
  newCollection.on = spm.on.bind(newCollection);
  newCollection.off = spm.off.bind(newCollection);
  newCollection.fetch = spm.fetch.bind(newCollection);
  newCollection.save = spm.save.bind(newCollection);

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

extend = spm.extend.bind(null, create);

module.exports = {
  create: create,
  extend: extend
};
