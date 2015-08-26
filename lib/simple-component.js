'use strict';

var sh = require('./simple-helpers'),
    _ = require('lodash'),
    sce = require('./simple-create-extend'),
    simpleEvents = require('./simple-events'),
    GLOBAL_CONFIG = require('./global-config'),
    EVENTS = GLOBAL_CONFIG.EVENTS,
    prototype,
    defaultOptions,
    create,
    extend;

prototype = {};

// augment prototype with events
_.assign(prototype, simpleEvents);

// define create and extend methods
create = sce.create.bind(null, prototype, {}); // {} as last param because there are no default options
extend = sce.extend.bind(null, create);

module.exports = {
  create: create,
  extend: extend
};
