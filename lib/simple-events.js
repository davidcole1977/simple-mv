'use strict';

var sh = require('./simple-helpers'),
    _ = require('lodash'),
    appSubsList = require('./app-subscriptions');

function unsubscribe (subscription) {
  subscription.unsubscribe();
}

module.exports = {

  getTopicName: function getTopicName (options) {
    var topic;

    if (typeof options.target === 'undefined') {
      options.target = this;
    }

    topic = options.eventType + ':' + options.target.id;

    if (typeof options.keypath === 'string') {
      topic += ':' + options.keypath;
    }

    return topic;
  },

  getAllTopicNames: function getAllTopicNames (options) {
    var publishTopics;

    if (typeof options.target === 'undefined') {
      options.target = this;
    }

    publishTopics = [
      options.eventType,
      options.eventType + ':' + options.target.id
    ];

    if (options.keypath) {
      publishTopics.push(options.eventType + ':' + options.target.id + ':' + options.keypath);
    }

    return publishTopics;
  },

  emitEvent: function emitEvent (options) {
    this.getAllTopicNames(options).forEach(function (topic) {
      appSubsList.publish(topic, options.publishParams);
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

    newSubscription = appSubsList.createSubscription(topic, callback);

    if (typeof options.nameSpace === 'string') {
      this.selfSubscriptions[topic][options.nameSpace].push(newSubscription);
    } else {
      this.selfSubscriptions[topic].unNameSpaced.push(newSubscription);
    }
  },

  addListener: function addListener (options, callback) {
    var newSubscription,
        topic = this.getTopicName(options);

    if (typeof this.externalSubscriptions[topic] === 'undefined') {
      this.externalSubscriptions[topic] = {
        unNameSpaced: []
      };
    }

    if (typeof options.nameSpace === 'string' && typeof this.externalSubscriptions[topic][options.nameSpace] === 'undefined') {
      this.externalSubscriptions[topic][options.nameSpace] = [];
    }

    newSubscription = appSubsList.createSubscription(topic, callback);

    if (typeof options.nameSpace === 'string') {
      this.externalSubscriptions[topic][options.nameSpace].push(newSubscription);
    } else {
      this.externalSubscriptions[topic].unNameSpaced.push(newSubscription);
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
  },

  removeListener: function removeListever (options) {
    var subsArray,
        topic = this.getTopicName(options);

    // if it's not namespaced, unsubscribe and remove all entries in the non-namespaced array
    if (typeof options.nameSpace === 'undefined') {
      subsArray = this.externalSubscriptions[topic].unNameSpaced;
      subsArray.forEach(unsubscribe);
      subsArray.splice(0, subsArray.length); // remove all elements from the self subscriptions array
    // if it is namespaced, unsibscribe and delete the namespaced array
    } else {
      this.externalSubscriptions[topic][options.nameSpace];
      this.externalSubscriptions[topic][options.nameSpace].forEach(unsubscribe);
      delete this.externalSubscriptions[topic][options.nameSpace];
    }
  },

  // TODO: refactor addListener etc. out to this module as far as possible

  // addListener: function addListener () {

  // },

  // removeListener: function removeListener () {

  // }

};
