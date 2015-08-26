'use strict';

var sh = require('./simple-helpers'),
    _ = require('lodash'),
    sce = require('./simple-create-extend'),
    simpleEvents = require('./simple-events'),
    simpleServerComms = require('./simple-server-comms'),
    modelSubsLists = require('./app-subscriptions'),
    GLOBAL_CONFIG = require('./global-config'),
    EVENTS = GLOBAL_CONFIG.EVENTS,
    prototype,
    defaultOptions,
    create,
    extend;

prototype = {

  // NOT COMPLETE
  emitCollectionEvent: function emitCollectionEvent(keypath, eventType) {
    var publishParams = {
          // TBC
        };

    this.subsList.publish(eventType, publishParams);
    // this.subsList.publish(eventType + ':' + keypath, publishParams);
  }
};

// augment prototype with events and server comms methods
_.assign(prototype, simpleEvents, simpleServerComms);

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
