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

    // this check might not be necessary, as getAllTopicNames is only used when emitting events 
    // when the target is probably always going to be the current component (this)
    if (typeof options.target === 'undefined') {
      options.target = this;
    }

    publishTopics = [
      options.eventType,
      options.eventType + ':' + options.target.id
    ];

    if (typeof options.keypath === 'string') {
      publishTopics.push(options.eventType + ':' + options.target.id + ':' + options.keypath);
    }

    return publishTopics;
  },

  emitEvent: function emitEvent (options) {
    this.getAllTopicNames(options).forEach(function (topic) {
      appSubsList.publish(topic, options.publishParams);
    });
  },

  // private method / not public API
  // subsScope = 'internal' or 'external' listener / subscription
  // in other words, are we listening to this component, or another component?
  addListener: function addListener (options, subsScope, callback) {
    var newSubscription,
        topic = this.getTopicName(options);

    if (typeof this.subscriptions[subsScope][topic] === 'undefined') {
      this.subscriptions[subsScope][topic] = {
        unNameSpaced: []
      };
    }

    if (typeof options.nameSpace === 'string' && typeof this.subscriptions[subsScope][topic][options.nameSpace] === 'undefined') {
      this.subscriptions[subsScope][topic][options.nameSpace] = [];
    }

    newSubscription = appSubsList.createSubscription(topic, callback);

    if (typeof options.nameSpace === 'string') {
      this.subscriptions[subsScope][topic][options.nameSpace].push(newSubscription);
    } else {
      this.subscriptions[subsScope][topic].unNameSpaced.push(newSubscription);
    }
  },

  // private method / not public API
  // subsScope = 'internal' or 'external' listener / subscription
  // in other words, are we listening to this component, or another component?
  removeListener: function removeListener (options, subsScope) {
    var subsArray,
        topic = this.getTopicName(options);

    // if it's not namespaced, unsubscribe and remove all entries in the non-namespaced array
    if (typeof options.nameSpace === 'undefined') {
      subsArray = this.subscriptions[subsScope][topic].unNameSpaced;
      subsArray.forEach(unsubscribe);
      subsArray.splice(0, subsArray.length); // remove all elements from the self subscriptions array
    // if it is namespaced, unsibscribe and delete the namespaced array
    } else {
      this.subscriptions[subsScope][topic][options.nameSpace];
      this.subscriptions[subsScope][topic][options.nameSpace].forEach(unsubscribe);
      delete this.subscriptions[subsScope][topic][options.nameSpace];
    }
  },

  // on and off concern internal / own events
  on: function on (options, callback) {
    this.addListener(options, 'internal', callback);
  },

  off: function off (options) {
    this.removeListener(options, 'internal');
  },

  // listenTo and stopListeningTo concern external / other components' events
  listenTo: function listenTo (options, callback) {
    this.addListener(options, 'external', callback);
  },

  stopListeningTo: function stopListeningTo (options) {
    this.removeListener(options, 'external');
  }

};
