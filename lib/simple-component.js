'use strict';

var sh = require('./simple-helpers'),
    _ = require('lodash'),
    GLOBAL_CONFIG = require('./global-config'),
    sce = require('./simple-create-extend');

var EVENTS = GLOBAL_CONFIG.EVENTS,
    prototype,
    defaultOptions,
    create,
    extend;

prototype = {

  createEventType: EVENTS.COMPONENT.CREATE

};

// define default options
defaultOptions = {
  type: 'component'
};

// define create and extend methods
create = sce.create.bind(null, prototype, defaultOptions); // {} as last param because there are no default options
extend = sce.extend.bind(null, create);

module.exports = {
  create: create,
  extend: extend
};
