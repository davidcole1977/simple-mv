'use strict';

var sh = require('./simple-helpers'),
    _ = require('lodash'),
    sce = require('./simple-create-extend'),
    simpleEvents = require('./simple-events'),
    appSubsList = require('./app-subscriptions'),
    GLOBAL_CONFIG = require('./global-config'),
    EVENT_TYPES = GLOBAL_CONFIG.EVENT_TYPES,
    prototype,
    defaultOptions,
    create,
    extend;

// view prototype
prototype = {
  bind: function bind (options) {
    var viewDatum = (typeof options.viewDatum === 'undefined') ? null : options.viewDatum,
        modelDatum = (typeof options.modelDatum === 'undefined') ? null : options.modelDatum,
        eventNameSpace = (modelDatum === null) ? '' : ':' + modelDatum,
        modelData;

    // get model data to be initially assigned to view data
    if (modelDatum === null) {
      modelData = options.model.getRawData();
    } else {
      // it might not exist yet, hence try / catch
      try {
        modelData = options.model.get(modelDatum);
      } catch (error) {
        modelData = null;
      }
    }

    // should we assign the model data to the entire view data, or a named datum?
    if (modelDatum !== null && viewDatum === null) {
      viewDatum = modelDatum;
    }

    // assign the model data
    if (viewDatum === null) {
      this.data = modelData;
    } else {
      this.data[viewDatum] = modelData;
    }

    // use addListener method instead?
    appSubsList.createSubscription(EVENT_TYPES.DATUM_UPDATE + ':' + options.model.id + eventNameSpace, this.receiveBindEvent.bind(this, modelDatum, viewDatum));
  }, 

  receiveBindEvent: function receiveBindEvent (modelDatum, viewDatum, modelEvent) {
    var modelData = (modelDatum === null) ? modelEvent.model.getRawData() : modelEvent.model.get(modelDatum);

    if (viewDatum !== null) {
      this.data[viewDatum] = modelData;
    } else {
      this.data = modelData;
    }
  },

  unbind: function unbind () {

  },

  emitViewEvent: function emitViewEvent () {
    
  }
};

// augment prototype with events methods
_.assign(prototype, simpleEvents);

defaultOptions = {
  type: 'view',
  data: {}
};

// define create and extend methods
create = sce.create.bind(null, prototype, defaultOptions);
extend = sce.extend.bind(null, create);

module.exports = {
  create: create,
  extend: extend
};
