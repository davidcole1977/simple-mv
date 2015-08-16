'use strict';

var sh = require('./simple-helpers'),
    _ = require('lodash'),
    modelSubs = require('./model-subscriptions'),
    GLOBAL_CONFIG = require('./global-config'),
    EVENT_TYPES = GLOBAL_CONFIG.EVENT_TYPES,
    view;

var cow = 'moo!';

// view prototype
view = {
  bind: function (options) {
    // options: {model, modelDatum, viewDatum}
    // only model is required – default view model is view.data
    // pubsub topic: "{{EVENT_TYPES.MODEL_UPDATE}}"
    // pubsub topic: "{{options.modelDatumName}}"
    this.data = options.model.getRawData();
    options.model.subsList.createSubscription(EVENT_TYPES.MODEL_UPDATE, this.receiveBindEvent.bind(this));
  }, 

  addListener: function (options, callback) {
    // options: {model, modelDatumName, modelEvent}
    // pubsub topic: "{{options.modelEvent}}"
    // pubsub topic: "{{options.modelDatumName}}"
  },

  receiveBindEvent: function (modelEvent) {
    this.data = modelEvent.model.getRawData();
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
