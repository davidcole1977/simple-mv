'use strict';

var sh = require('./simple-helpers'),
    _ = require('lodash'),
    GLOBAL_CONFIG = require('./global-config'),
    simpleEvents = require('./simple-events');
    
var EVENTS = GLOBAL_CONFIG.EVENTS;

module.exports = {
  
  create: function create (prototype, defaultOptions, options) {
    var component;

    options = (typeof options === 'object') ? options : {};

    // augment prototype with events methods and params
    _.assign(prototype, simpleEvents);

    // throw error if attempting to override prototype member methods
    if (sh.overridesProps(prototype, options)) {
      throw new Error('create(): Overriding prototype parameters is not permitted');
    }

    component = Object.create(prototype);

    // assign default options and override with user-specified options
    _.assign(component, _.cloneDeep(defaultOptions), _.cloneDeep(options));

    component.id = _.uniqueId(component.type);

    // manage event listeners, inteenal (listen to self) and external (listen to other components)
    component.subscriptions = {
      internal: {},
      external: {}
    };

    // optional initialisation function
    if (typeof options.initialise === 'function') {
      options.initialise.call(component, component);
    }

    // the component create event should always be emitted after everything else has been done
    component.emitEvent(EVENTS[component.eventNamespace].CREATE);

    return component;
  },

  extend: function extend (create, options) {
    if (!sh.isAnObject(options)) {
      throw new Error('extend(options) expects a single argument: options {object}');
    }

    return {
      create: create.bind(null, options)
    };
  }

};