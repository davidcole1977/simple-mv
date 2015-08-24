'use strict';

var sh = require('./simple-helpers'),
    _ = require('lodash');

function unsubscribe (subscription) {
  subscription.unsubscribe();
}

module.exports = {

  on: function on () {
    var topic = arguments[0],
        topicNameSpace = (arguments.length === 2) ? null : arguments[1],
        callback = (arguments.length === 2) ? arguments[1] : arguments[2],
        newSubscription;

    if (typeof this.selfSubscriptions[topic] === 'undefined') {
      this.selfSubscriptions[topic] = {
        unNameSpaced: []
      };
    }

    if (topicNameSpace !== null && typeof this.selfSubscriptions[topic][topicNameSpace] === 'undefined') {
      this.selfSubscriptions[topic][topicNameSpace] = [];
    }

    newSubscription = this.subsList.createSubscription(topic, callback);

    if (topicNameSpace === null) {
      this.selfSubscriptions[topic].unNameSpaced.push(newSubscription);
    } else {
      this.selfSubscriptions[topic][topicNameSpace].push(newSubscription);
    }
  },

  off: function off (topic, nameSpace) {
    var subsArray;

    if (typeof nameSpace === 'undefined') {
      subsArray = this.selfSubscriptions[topic].unNameSpaced;
    } else {
      subsArray = this.selfSubscriptions[topic][nameSpace];
    }

    subsArray.forEach(unsubscribe);
    subsArray.splice(0, subsArray.length); // remove all elements from the self subscriptions array
  }

  // TODO: refactor addListener etc. out to this module as far as possible

  // emitEvent: function emitEvent () {

  // },

  // addListener: function addListener () {

  // },

  // removeListener: function removeListener () {

  // }

};