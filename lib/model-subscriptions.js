'use strict';

/**
 * Creates and exports a validator list that will be shared by all models
 */
 
var sps = require('./simple-pubsub'),
    modelPubsubList = sps.create();

module.exports = modelPubsubList;
