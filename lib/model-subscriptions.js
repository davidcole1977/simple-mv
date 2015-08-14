'use strict';

/**
 * Creates and exports a subscriptions list that will be shared by all models
 */
 
var sps = require('./simple-pubsub'),
    modelPubsubList = sps.create();

module.exports = modelPubsubList;
