'use strict';

var sps = require('./simple-pubsub'),
    modelPubSubLists = {};

function create (modelID) {
  modelPubSubLists[modelID] = sps.create();
  return modelPubSubLists[modelID];
}

module.exports = {
  create: create
};
