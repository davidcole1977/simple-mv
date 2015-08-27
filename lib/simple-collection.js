'use strict';

var sh = require('./simple-helpers'),
    _ = require('lodash'),
    GLOBAL_CONFIG = require('./global-config'),
    sce = require('./simple-create-extend');
    // simpleServerComms = require('./simple-server-comms');

var EVENTS = GLOBAL_CONFIG.EVENTS,
    prototype,
    defaultOptions,
    create,
    extend;

prototype = {

  eventNamespace: 'COLLECTION'

};

// augment prototype with server comms methods
// _.assign(prototype, simpleServerComms);

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
