'use strict';

var sh = require('./simple-helpers'),
    _ = require('lodash'),
    modelSubs = require('./model-subscriptions'),
    GLOBAL_CONFIG = require('./global-config'),
    EVENT_TYPES = GLOBAL_CONFIG.EVENT_TYPES,
    view;

// view prototype
view = {
  bind: function (options) {
    // options: {model, modelDatumName, viewDatum}
    // only model is required – default view model is view.data
    // eg. view.data[modelID][modelDatumName] (MAYBE...)
    // pubsub topic: "{{options.model.id}}:{{EVENT_TYPES.MODEL_UPDATE}}"
    // pubsub topic: "{{options.model.id}}:{{options.modelDatumName}}:{{EVENT_TYPES.MODEL_UPDATE}}"
  }, 

  addListener: function (options, callback) {
    // options: {model, modelDatumName, event}
    // pubsub topic: "{{options.model.id}}:{{options.event}}"
    // pubsub topic: "{{options.model.id}}:{{options.modelDatumName}}:{{options.event}}"

    // sh.getTopicName({modelID: '', modelDatumName: '', event: ''})
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
