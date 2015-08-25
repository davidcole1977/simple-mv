'use strict';

var sh = require('./simple-helpers'),
    _ = require('lodash'),
    appSubsLists = require('./app-subscriptions');

function unsubscribe (subscription) {
  subscription.unsubscribe();
}

module.exports = {

  getTopicName: function getTopicName (options) {
    var topic = options.eventType + ':' + this.id;

    if (typeof options.keypath === 'string') {
      topic += ':' + options.keypath;
    }

    return topic;
  },

  getAllTopicNames: function getAllTopicNames (options) {
    var publishTopics = [
          options.eventType,
          options.eventType + ':' + this.id
        ];

    if (options.keypath) {
      publishTopics.push(options.eventType + ':' + this.id + ':' + options.keypath);
    }

    return publishTopics;
  },

  emitEvent: function emitEvent (options) {
    this.getAllTopicNames(options).forEach(function (topic) {
      appSubsLists.publish(topic, options.publishParams);
    });
  },

  on: function on (options, callback) {
    var newSubscription,
        topic = this.getTopicName(options);

    if (typeof this.selfSubscriptions[topic] === 'undefined') {
      this.selfSubscriptions[topic] = {
        unNameSpaced: []
      };
    }

    if (typeof options.nameSpace === 'string' && typeof this.selfSubscriptions[topic][options.nameSpace] === 'undefined') {
      this.selfSubscriptions[topic][options.nameSpace] = [];
    }

    newSubscription = appSubsLists.createSubscription(topic, callback);

    if (typeof options.nameSpace === 'string') {
      this.selfSubscriptions[topic][options.nameSpace].push(newSubscription);
    } else {
      this.selfSubscriptions[topic].unNameSpaced.push(newSubscription);
    }
  },

  off: function off (options) {
    var subsArray,
        topic = this.getTopicName(options);

    // if it's not namespaced, unsubscribe and remove all entries in the non-namespaced array
    if (typeof options.nameSpace === 'undefined') {
      subsArray = this.selfSubscriptions[topic].unNameSpaced;
      subsArray.forEach(unsubscribe);
      subsArray.splice(0, subsArray.length); // remove all elements from the self subscriptions array
    // if it is namespaced, unsibscribe and delete the namespaced array
    } else {
      this.selfSubscriptions[topic][options.nameSpace];
      this.selfSubscriptions[topic][options.nameSpace].forEach(unsubscribe);
      delete this.selfSubscriptions[topic][options.nameSpace];
    }
  }

  // TODO: refactor addListener etc. out to this module as far as possible

  // addListener: function addListener () {

  // },

  // removeListener: function removeListener () {

  // }

};
