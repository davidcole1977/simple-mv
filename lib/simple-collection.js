'use strict';

var sh = require('./simple-helpers'),
    _ = require('lodash'),
    GLOBAL_CONFIG = require('./global-config'),
    sce = require('./simple-create-extend'),
    simpleServerComms = require('./simple-server-comms'),
    modelSubsLists = require('./app-subscriptions');

var EVENTS = GLOBAL_CONFIG.EVENTS,
    prototype,
    defaultOptions,
    create,
    extend;

prototype = {

  createEventType: EVENTS.COLLECTION.CREATE,

  // NOT COMPLETE
  emitCollectionEvent: function emitCollectionEvent(keypath, eventType) {
    var publishParams = {
          // TBC
        };

    this.subsList.publish(eventType, publishParams);
    // this.subsList.publish(eventType + ':' + keypath, publishParams);
  }
};

// augment prototype with server comms methods
_.assign(prototype, simpleServerComms);

defaultOptions = {
  type: 'collection',
  models: [],
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
