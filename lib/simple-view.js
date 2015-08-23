'use strict';

var sh = require('./simple-helpers'),
    _ = require('lodash'),
    modelSubs = require('./model-subscriptions'),
    GLOBAL_CONFIG = require('./global-config'),
    EVENT_TYPES = GLOBAL_CONFIG.EVENT_TYPES,
    viewPrototype;

// view prototype
viewPrototype = {
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
    
    options.model.subsList.createSubscription(EVENT_TYPES.DATUM_UPDATE + eventNameSpace, this.receiveBindEvent.bind(this, modelDatum, viewDatum));
  }, 

  addListener: function addListener (options, callback) {
    var eventNameSpace = (typeof options.keypath === 'string') ? ':' + options.keypath : '';

    options.model.subsList.createSubscription(options.event + eventNameSpace, callback);
  },

  receiveBindEvent: function receiveBindEvent (modelDatum, viewDatum, modelEvent) {
    var modelData = modelDatum === null ? modelEvent.model.getRawData() : modelEvent.model.get(modelDatum);

    if (viewDatum !== null) {
      this.data[viewDatum] = modelData;
    } else {
      this.data = modelData;
    }
  }
};

function create () {
  var newView = Object.create(viewPrototype);

  newView.id = _.uniqueId('view_');
  newView.data = {}; // default view model - used if datum not specified in bindings

  return newView;
}

module.exports = {
  create: create
};
