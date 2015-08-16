'use strict';

/**
 * Creates and exports a subscriptions list that will be shared by all models
 */
 
var sps = require('./simple-pubsub'),
    modelPubsubList = sps.create();

// module.exports = modelPubsubList;
// THERE NEEDS TO BE A SUBSCRIPTIONS LIST FOR EACH MODEL. MAINTAIN A MAP (BY ID) OF MODEL SUBSCRIPTION LISTS AND EXPOSE A CREATE METHOD AND A GET (BY ID) AND REMOVE METHOD
// ADDITIONALLY, IN SIMPLE-PUBSUB WE NEED TO BE ABLE TO SUBSCRIBE TO ALL EVENTS "*" FOR A GIVEN MODEL OR DATUM. START OFF DOING IT IN THE SIMPLEST WAY POSSIBLE AND WE CAN OPTIMISE LATER.
