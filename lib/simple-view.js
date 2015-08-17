'use strict';

var sh = require('./simple-helpers'),
    _ = require('lodash'),
    modelSubs = require('./model-subscriptions'),
    GLOBAL_CONFIG = require('./global-config'),
    EVENT_TYPES = GLOBAL_CONFIG.EVENT_TYPES,
    view;

// view prototype
view = {
  bind: function bind (options) {
    var viewDatum = (typeof options.viewDatum === 'undefined') ? null : options.viewDatum,
        modelDatum = (typeof options.modelDatum === 'undefined') ? null : options.modelDatum,
        eventNameSpace = (modelDatum === null) ? '' : ':' + modelDatum,
        modelData;

    if (modelDatum === null) {
      modelData = options.model.getRawData();
    } else {
      try {
        modelData = options.model.get(modelDatum);
      } catch (error) {
        modelData = {};
      }
    }

    if (viewDatum === null) {
      this.data = modelData;
    } else {
      this.data[viewDatum] = modelData;
    }
    
    options.model.subsList.createSubscription(EVENT_TYPES.DATUM_UPDATE + eventNameSpace, this.receiveBindEvent.bind(this, modelDatum, viewDatum));
  }, 

  addListener: function addListener (options, callback) {

  },

  receiveBindEvent: function receiveBindEvent (modelDatum, viewDatum, modelEvent) {
    var modelData = modelEvent.model.getRawData();

    if (viewDatum !== null) {
      this.data[viewDatum] = modelData;
    } else {
      this.data = modelData;
    }
  }
};

function create () {
  var newView = Object.create(view);

  newView.id = _.uniqueId('view_');
  newView.data = {}; // default view model - used if datum not specified in bindings

  return newView;
}

module.exports = {
  create: create
};
