var _ = require('lodash'),
    pubsubList,
    subscription;

pubsubList = {
  createSubscription: function createSubscription (topic, callback) {
    var self = this,
        subscription;

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
  },

  // publish: function publish (topic, params) {
  //   // early out if there are no subscribers to the topic – fail silently
  //   if (typeof subscriptions[topic] === 'undefined' || subscriptions[topic].length === 0) {
  //     return;
  //   }

  //   params = (typeof params !== 'undefined') ? params : null;

  //   _.forOwn(subscriptions[topic], function (subscription) {
  //     subscription.callback(params);
  //   });
  // },

  // removeTopicIfNoSubscribers: function removeTopicIfNoSubscribers (topic) {
  //   if (getSubscriptionCount(topic) === 0) {
  //     delete subscriptions[topic];
  //   }
  // }


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