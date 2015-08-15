'use strict';

var sh = require('./simple-helpers'),
    _ = require('lodash'),
    modelSubs = require('./model-subscriptions'),
    GLOBAL_CONFIG = require('./global-config'),
    EVENT_TYPES = GLOBAL_CONFIG.EVENT_TYPES,
    view;

// view prototype
view = {
  getModel: function (model) {
    // model (ID string or model object)
  },

  bind: function (options) {
    // options: {model (ID or OBJECT), modelDatum, viewDatum}
  }, 

  addListener: function (options, callback) {
    // options: {model (ID or OBJECT), datum, event}
  }
};

function create () {
  var newView = Object.create(view);

  newView.id = _.uniqueId('view_');
  newView.data = {};

  return newView;
}

module.exports = {
  create: create
};
