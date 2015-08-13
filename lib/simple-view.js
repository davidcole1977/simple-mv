'use strict';

var sh = require('./simple-helpers'),
    _ = require('lodash'),
    modelSubs = require('./model-subscriptions'),
    GLOBAL_CONFIG = require('./global-config'),
    EVENT_TYPES = GLOBAL_CONFIG.EVENT_TYPES,
    view;

// view prototype
view = {
  
};

function create () {
  var newView;

  newView = Object.create(view);
  newView.id = _.uniqueId('view_');

  return newView;
}

module.exports = {
  create: create
};
