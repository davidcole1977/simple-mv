'use strict';

var sh = require('./simple-helpers'),
    _ = require('lodash'),
    sce = require('./simple-create-extend'),
    simpleEvents = require('./simple-events'),
    appSubsList = require('./app-subscriptions'),
    GLOBAL_CONFIG = require('./global-config'),
    EVENTS = GLOBAL_CONFIG.EVENTS,
    prototype,
    defaultOptions,
    create,
    extend;

// view prototype
prototype = {
  bind: function bind (options) {
    var viewDatum = (typeof options.viewDatum === 'undefined') ? null : options.viewDatum,
        targetDatum = (typeof options.targetDatum === 'undefined') ? null : options.targetDatum,
        eventNameSpace = (targetDatum === null) ? '' : ':' + targetDatum,
        targetData;

    // get model data to be initially assigned to view data
    if (targetDatum === null) {
      targetData = options.target.getRawData();
    } else {
      // it might not exist yet, hence try / catch
      try {
        targetData = options.target.get(targetDatum);
      } catch (error) {
        targetData = null;
      }
    }

    // should we assign the model data to the entire view data, or a named datum?
    if (targetDatum !== null && viewDatum === null) {
      viewDatum = targetDatum;
    }

    // assign the model data
    if (viewDatum === null) {
      this.data = targetData;
    } else {
      this.data[viewDatum] = targetData;
    }

    // use addListener method instead?
    appSubsList.createSubscription(EVENTS.MODEL.DATUM_UPDATE + ':' + options.target.id + eventNameSpace, this.receiveBindEvent.bind(this, targetDatum, viewDatum));
  }, 

  receiveBindEvent: function receiveBindEvent (targetDatum, viewDatum, event) {
    var targetData = (targetDatum === null) ? event.target.getRawData() : event.target.get(targetDatum);

    if (viewDatum !== null) {
      this.data[viewDatum] = targetData;
    } else {
      this.data = targetData;
    }
  },

  unbind: function unbind () {

  },

  emitViewEvent: function emitViewEvent () {
    
  }
};

// augment prototype with events methods
_.assign(prototype, simpleEvents);

defaultOptions = {
  type: 'view',
  data: {}
};

// define create and extend methods
create = sce.create.bind(null, prototype, defaultOptions);
extend = sce.extend.bind(null, create);

module.exports = {
  create: create,
  extend: extend
};
