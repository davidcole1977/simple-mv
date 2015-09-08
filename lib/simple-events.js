'use strict';

var sh = require('./simple-helpers'),
    _ = require('lodash'),
    appSubsList = require('./app-subscriptions');

function unsubscribe (subscription) {
  subscription.unsubscribe();
}

function isDelegatedListener (options) {
  return (typeof options.delegate === 'boolean') && (options.delegate === true) && (typeof options.keypath === 'string');
}

function delegatedCallback (delegatedKeypath, callback, event) {
  if (sh.keypathIsSameOrDescendent(delegatedKeypath, event.keypath)) {
    callback(event);
  }
}

module.exports = {

  // private methods

  getTopicName: function getTopicName (options, isDelegated) {
    var topic;

    if (typeof options.target === 'undefined') {
      options.target = this;
    }

    topic = options.eventType + ':' + options.target.id;

    if (typeof options.keypath === 'string' && !isDelegated) {
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

  getDelegatedCallback: function getDelegatedCallback (keypath, callback) {
    return delegatedCallback.bind(this, keypath, callback);
  },

  // TODO: refactor localSubsList into separate class?
  createLocalSubsListTopic: function createLocalSubsListTopic (options) {
    if (typeof this.subscriptions[options.subsScope][options.topic] === 'undefined') {
      this.subscriptions[options.subsScope][options.topic] = {
        unNameSpaced: []
      };
    }

    if (typeof options.nameSpace === 'string' && typeof this.subscriptions[options.subsScope][options.topic][options.nameSpace] === 'undefined') {
      this.subscriptions[options.subsScope][options.topic][options.nameSpace] = [];
    }
  },

  // TODO: refactor localSubsList into separate class?
  getLocalSubsListTopic: function getLocalSubsListTopic (options) {
    var nameSpace = (typeof options.nameSpace === 'string') ? options.nameSpace : 'unNameSpaced';
    return this.subscriptions[options.subsScope][options.topic][nameSpace];
  },

  assignSubscription: function assignSubscription (options, callback) {
    var newSubscription = appSubsList.createSubscription(options.topic, callback);

    this.createLocalSubsListTopic(options);
    this.getLocalSubsListTopic(options).push(newSubscription);
  },

  // subsScope = 'internal' or 'external' listener / subscription
  // in other words, are we listening to this component, or another component?
  addListener: function addListener (options, subsScope, callback) {
    var subsOptions,
        isDelegated = isDelegatedListener(options);

    callback = isDelegated ? this.getDelegatedCallback(options.keypath, callback) : callback;

    subsOptions = {
      topic: this.getTopicName(options, isDelegated),
      nameSpace: options.nameSpace,
      subsScope: subsScope
    };

    this.assignSubscription(subsOptions, callback);
  },

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

    // if it is namespaced, unsubscribe and delete the namespaced array
    } else {
      this.subscriptions[subsScope][topic][options.nameSpace].forEach(unsubscribe);
      delete this.subscriptions[subsScope][topic][options.nameSpace];
    }
  },

  // public API

  emitEvent: function emitEvent (eventType, keypath) {
    var publishParams = {
          target: this,
          eventType: eventType
        },
        topicNameOptions = {
          eventType: eventType
        };

    if (typeof keypath === 'string') {
      topicNameOptions.keypath = keypath;
      publishParams.keypath = keypath;
    }

    this.getAllTopicNames(topicNameOptions).forEach(function (topic) {
      appSubsList.publish(topic, publishParams);
    });
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
