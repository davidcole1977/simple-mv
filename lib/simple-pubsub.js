'use strict';

var _ = require('lodash'),
    pubsubList,
    subscription;

pubsubList = {
  createSubscription: function createSubscription (topic, callback) {
    var self = this,
        newSubscription;

    newSubscription = {
      id: _.uniqueId('sub_'),
      topic: topic,
      callback: callback,
      unsubscribe: function () {
        self.removeSubscription(this);
      }
    };

    this.addSubscription(newSubscription);

    return newSubscription;
  },

  addSubscription: function addSubscription (subscription) {
    // if topic doesn't exist, create it
    if (typeof this.subscriptions[subscription.topic] === 'undefined') {
      this.subscriptions[subscription.topic] = {};
    }

    this.subscriptions[subscription.topic][subscription.id] = subscription;
  },

  getSubscriptionCount: function getSubscriptionCount (topic) {
    return (typeof this.subscriptions[topic] === 'undefined') ? 0 : Object.keys(this.subscriptions[topic]).length;
  },

  removeSubscription: function removeSubscription (subscription) {
    delete this.subscriptions[subscription.topic][subscription.id];

    if (this.getSubscriptionCount(subscription.topic) === 0) {
      delete this.subscriptions[subscription.topic];
    }
  },

  publish: function publish (topic, params) {
    // early out if there are no subscribers to the topic – fail silently
    if (typeof this.subscriptions[topic] === 'undefined' || this.subscriptions[topic].length === 0) {
      return;
    }

    params = (typeof params !== 'undefined') ? params : null;

    _.forOwn(this.subscriptions[topic], function (subscription) {
      subscription.callback(params);
    });
  }

};

function create () {
  var newPubsubList;

  newPubsubList = Object.create(pubsubList);
  newPubsubList.subscriptions = {};

  return newPubsubList;
}

module.exports = {
  create: create
};