'use strict';

var sh = require('./simple-helpers'),
    _ = require('lodash'),
    appSubsList = require('./app-subscriptions');

function unsubscribe (subscription) {
  subscription.unsubscribe();
}

function isDelegatedListener (keypath, delegate) {
  return (typeof delegate === 'boolean') && (delegate === true) && (typeof keypath === 'string');
}

function delegatedCallback (delegatedKeypath, callback, event) {
  if (sh.keypathIsSameOrDescendent(delegatedKeypath, event.keypath)) {
    callback(event);
  }
}

module.exports = {

  /**
   * private / non-api methods
   */

  getListenerTopicName: function getListenerTopicName (options, isDelegated) {
    var topic = options.eventType + ':' + options.target.id;

    if (typeof options.keypath === 'string' && !isDelegated) {
      topic += ':' + options.keypath;
    }

    return topic;
  },

  getEmissionTopicNames: function getEmissionTopicNames (options) {
    var publishTopics = [
      options.eventType,
      options.eventType + ':' + this.id
    ];

    if (typeof options.keypath === 'string') {
      publishTopics.push(options.eventType + ':' + this.id + ':' + options.keypath);
    }

    return publishTopics;
  },

  delegateCallback: function delegateCallback (keypath, callback) {
    return delegatedCallback.bind(this, keypath, callback);
  },

  createLocalSubsListTopic: function createLocalSubsListTopic (topic, subsScope, nameSpace) {
    nameSpace = (typeof nameSpace === 'string') ? nameSpace : 'unNameSpaced';

    if (typeof this.subscriptions[subsScope][topic] === 'undefined') {
      this.subscriptions[subsScope][topic] = {};
    }

    if (typeof this.subscriptions[subsScope][topic][nameSpace] === 'undefined') {
      this.subscriptions[subsScope][topic][nameSpace] = [];
    }

    return this.subscriptions[subsScope][topic][nameSpace];
  },

  // subsScope = 'internal' or 'external' listener / subscription - are we listening to this component, or another component?
  addListener: function addListener (options, subsScope, callback) {
    var isDelegated = isDelegatedListener(options.keypath, options.delegate),
        topic = this.getListenerTopicName(options, isDelegated),
        newSubscription;

    callback = isDelegated ? this.delegateCallback(options.keypath, callback) : callback;
    newSubscription = appSubsList.createSubscription(topic, callback);

    this.createLocalSubsListTopic(topic, subsScope, options.nameSpace).push(newSubscription);
  },

  // subsScope = 'internal' or 'external' listener / subscription - are we listening to this component, or another component?
  removeListener: function removeListener (options, subsScope) {
    var nameSpace = (typeof options.nameSpace === 'undefined') ? 'unNameSpaced' : options.nameSpace,
        topic = this.getListenerTopicName(options),
        subsArray = this.subscriptions[subsScope][topic][nameSpace];
        
    subsArray.forEach(unsubscribe);

    // if it's not namespaced, remove all entries in the non-namespaced array, else delete the namespaced array
    if (nameSpace === 'unNameSpaced') {
      subsArray.splice(0, subsArray.length);
    } else {
      delete this.subscriptions[subsScope][topic][nameSpace];
    }
  },

  /**
   * public API
   */

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

    this.getEmissionTopicNames(topicNameOptions).forEach(function (topic) {
      appSubsList.publish(topic, publishParams);
    });
  },

  // on and off concern internal / own events
  on: function on (options, callback) {
    options.target = this;
    this.addListener(options, 'internal', callback);
  },

  off: function off (options) {
    options.target = this;
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
