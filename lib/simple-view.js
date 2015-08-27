'use strict';

var sh = require('./simple-helpers'),
    _ = require('lodash'),
    GLOBAL_CONFIG = require('./global-config'),
    sce = require('./simple-create-extend'),
    appSubsList = require('./app-subscriptions');

var EVENTS = GLOBAL_CONFIG.EVENTS,
    prototype,
    defaultOptions,
    create,
    extend;

// view prototype
prototype = {

  createEventType: EVENTS.VIEW.CREATE,

  bindData: function bindData (options) {
    var viewDatum = (typeof options.viewDatum === 'undefined') ? null : options.viewDatum,
        targetDatum = (typeof options.targetDatum === 'undefined') ? null : options.targetDatum,
        optionalKeypath = (targetDatum === null) ? '' : ':' + targetDatum,
        targetData,
        createTopic,
        updateTopic,
        removeTopic;

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

    createTopic = EVENTS.MODEL.DATUM_CREATE + ':' + options.target.id + optionalKeypath;
    updateTopic = EVENTS.MODEL.DATUM_UPDATE + ':' + options.target.id + optionalKeypath;
    removeTopic = EVENTS.MODEL.DATUM_REMOVE + ':' + options.target.id + optionalKeypath;

    appSubsList.createSubscription(createTopic, this.receiveBindEvent.bind(this, targetDatum, viewDatum));
    appSubsList.createSubscription(updateTopic, this.receiveBindEvent.bind(this, targetDatum, viewDatum));
    appSubsList.createSubscription(removeTopic, this.receiveBindEvent.bind(this, targetDatum, viewDatum));
  }, 

  unbindData: function unbindData () {

  },

  receiveBindEvent: function receiveBindEvent (targetDatum, viewDatum, event) {
    var targetData;

    if (event.eventType === EVENTS.MODEL.DATUM_REMOVE) {
      targetData = null;
    } else {
      targetData = (targetDatum === null) ? event.target.getRawData() : event.target.get(targetDatum);
    }

    this.updateBoundViewData(viewDatum, targetData);
    this.emitViewBindEvent(viewDatum, event.eventType);
  },

  updateBoundViewData: function updateBoundViewData (viewDatumKeyPath, targetData) {
    if (viewDatumKeyPath !== null) {
      this.data[viewDatumKeyPath] = targetData;
    } else {
      this.data = targetData;
    }
  },

  emitViewBindEvent: function emitViewBindEvent (viewDatumKeypath, modelDatumEventType) {
    var bindEventType;

    switch (modelDatumEventType) {
      case EVENTS.MODEL.DATUM_CREATE:
        bindEventType = EVENTS.VIEW.BOUND_DATA_CREATE;
        break;

      case EVENTS.MODEL.DATUM_UPDATE:
        bindEventType = EVENTS.VIEW.BOUND_DATA_UPDATE;
        break;

      case EVENTS.MODEL.DATUM_REMOVE:
        bindEventType = EVENTS.VIEW.BOUND_DATA_REMOVE;
        break;
    }

    this.emitViewEvent(viewDatumKeypath, bindEventType);
  },

  emitViewEvent: function emitViewEvent (keypath, eventType) {
    var publishParams = {
          keypath: keypath,
          target: this,
          eventType: eventType
        };

    this.emitEvent({
      eventType: eventType,
      keypath: keypath,
      publishParams: publishParams
    });
  }

};

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
