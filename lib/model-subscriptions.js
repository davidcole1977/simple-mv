'use strict';

/**
 * Creates and exports a subscriptions list that will be shared by all models
 */
 
var sps = require('./simple-pubsub'),
    modelPubSubLists = {};

function create (modelID) {
  modelPubSubLists[modelID] = sps.create();
  return modelPubSubLists[modelID];
}

module.exports = {
  create: create
};
