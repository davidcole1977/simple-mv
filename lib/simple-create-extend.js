'use strict';

var sh = require('./simple-helpers'),
    _ = require('lodash');
    // appSubsLists = require('./app-subscriptions');

module.exports = {
  extend: function extend (create, options) {
    if (!sh.isAnObject(options)) {
      throw new Error('extend(options) expects a single argument: options {object}');
    }

    return {
      create: create.bind(null, options)
    };
  },

  create: function create (prototype, defaultOptions, options) {
    var component;

    options = (typeof options === 'object') ? options : {};

    // throw error if attempting to override prototype member methods
    if (sh.overridesProps(prototype, options)) {
      throw new Error('create(): Overriding prototype parameters is not permitted');
    }

    component = Object.create(prototype);

    // assign default options and override with user-specified options
    _.assign(component, _.cloneDeep(defaultOptions), _.cloneDeep(options));

    component.id = _.uniqueId(component.type);
    // component.subsList = appSubsLists;
    component.selfSubscriptions = {};

    // optional initialisation function
    if (typeof options.initialise === 'function') {
      options.initialise.call(component);
    }

    return component;
  }
};