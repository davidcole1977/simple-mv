'use strict';

var sh = require('./simple-helpers'),
    _ = require('lodash'),
    GLOBAL_CONFIG = require('./global-config'),
    sce = require('./simple-create-extend');

var EVENTS = GLOBAL_CONFIG.EVENTS,
    // MODEL_EVENT_TYPES = [EVENTS.MODEL.DATUM_CREATE, EVENTS.MODEL.DATUM_UPDATE, EVENTS.MODEL.DATUM_REMOVE],
    // BINDING_NAMESPACE = 'data-binding',
    prototype,
    defaultOptions,
    create,
    extend;

// // not public API
// function createLookAheadDatum (data, keys, index) {
//   if (sh.stringContainsOnlyDigits(keys[index + 1])) {
//     return sh.createFilledArray(parseInt(keys[index + 1]), null);
//   } else {
//     return {};
//   }
// }

// // not public API
// function setDeep (data, keypath, keys, index, value) {
//   var reachedEnd = index === keys.length - 1;

//   // if the current datum doesn't exist, create it (empty array or object)
//   if (typeof data[keys[index]] === 'undefined' && !reachedEnd) {
//     data[keys[index]] = createLookAheadDatum(data, keys, index);
//   }

//   if (reachedEnd) {
//     data[keys[index]] = _.cloneDeep(value);
//   } else {
//     setDeep(data[keys[index]], keypath, keys, index + 1, value);
//   }
// }

// view prototype
prototype = {

  // not public API
  eventNamespace: 'VIEW'

  /**
   * Binding methods and parameters are being removed until it's clear there's a case for it.
   * Until then, Views are just generic components, really.
   */

  // // not public API
  // getInitialBoundData: function getInitialBoundData (targetModel, targetDatum) {
  //   if (targetDatum === '*') {
  //     return targetModel.getRawData();
  //   } else {
  //     // it might not exist yet, hence try / catch
  //     try {
  //       return targetModel.get(targetDatum);
  //     } catch (error) {
  //       return null;
  //     }
  //   }
  // },

  // // not public API
  // assignBoundData: function assignBoundData (viewKeypath, targetData) {
  //   var keys;

  //   if (viewKeypath === '*') {
  //     this.data = targetData;
  //   } else {
  //     keys = viewKeypath.split('.');
  //     setDeep(this.data, viewKeypath, keys, 0, targetData);
  //   }
  // },

  // // *********
  // // WE UNBIND BY MODEL, WITH OPTIONAL MODEL KEYPATH,
  // // BUT NOT BY VIEW KEYPATH
  // // *********
  // unbindData: function unbindData (options) {
  //   // var targetViewpath = (typeof options.targetDatum === 'undefined') ? '*' : options.targetDatum;
    
  //   // this.unassignBinding(options.target, targetViewpath);
  //   // delete this.bindings[options.target.id][targetViewpath];

  //   this.unassignBinding(options.target);
  // },

  // bindData: function bindData (options) {
  //   var viewKeypath = (typeof options.viewDatum === 'undefined') ? '*' : options.viewDatum,
  //       targetDatum = (typeof options.targetDatum === 'undefined') ? '*' : options.targetDatum,
  //       targetData;

  //   targetData = this.getInitialBoundData (options.target, targetDatum); 

  //   // do not assign null data to the view data root 
  //   if (!(viewKeypath === '*' && targetData === null)) {
  //     this.assignBoundData(viewKeypath, targetData);
  //   }
    
  //   this.assignBinding(options.target, targetDatum, viewKeypath);
  // },

  // // not public API
  // unassignDataBindListener: function assignDataBindListener (target, eventType) {
  //   this.stopListeningTo({
  //     target: target,
  //     eventType: eventType,
  //     nameSpace: BINDING_NAMESPACE,
  //   });
  // },

  // // not public API
  // assignDataBindListener: function assignDataBindListener (target, eventType) {
  //   this.listenTo({
  //     target: target,
  //     eventType: eventType,
  //     nameSpace: BINDING_NAMESPACE,
  //   },
  //   this.receiveBindEvent.bind(this));
  // },

  // // not public API
  // unassignBinding: function unassignBinding (target) {
  // // unassignBinding: function unassignBinding (target, targetKeypath) {
  //   var self = this;

  //   MODEL_EVENT_TYPES.forEach(this.unassignDataBindListener.bind(this, target));
  //   delete this.bindings[target.id];
  // },

  // // not public API
  // assignBinding: function assignBinding (target, targetKeypath, viewKeypath) {
  //   if (typeof this.bindings[target.id] === 'undefined') {
  //     this.bindings[target.id] = {};
  //     MODEL_EVENT_TYPES.forEach(this.assignDataBindListener.bind(this, target));
  //   }

  //   this.bindings[target.id][targetKeypath] = viewKeypath;
  // },

  // // not public API
  // receiveBindEvent: function receiveBindEvent (event) {
  //   var self, modelKeypaths;

  //   // early out if no bindings to target model exist
  //   if (typeof this.bindings[event.target.id] === 'undefined') {
  //     return;
  //   }

  //   self = this;
  //   modelKeypaths = Object.keys(this.bindings[event.target.id]);  

  //   modelKeypaths.forEach(function (modelKeypath) {
  //     var viewKeypath, modelData, combinedViewKeypath, combinedModelKeypath;

  //     // early out if model keypath doesn't match, or isn't ancestor of, changed keypath
  //     if (!sh.keypathIsSameOrDescendent(modelKeypath, event.keypath)) {
  //       return;
  //     }

  //     viewKeypath = self.bindings[event.target.id][modelKeypath];

  //     if (event.eventType === EVENTS.MODEL.DATUM_REMOVE) {
  //       modelData = null;
  //     } else {
  //       modelData = (modelKeypath === '*') ? event.target.getRawData() : event.target.get(event.keypath);
  //     }

  //     // TODO: refactor this out into a helper function? (it's fugly)
  //     combinedViewKeypath = (viewKeypath + sh.getKeypathDescendentPortion(modelKeypath, event.keypath)).replace(/^\*\./, ''); // viewKeypath + (event.keypath - modelKeypath)
  //     self.assignBoundData(combinedViewKeypath, modelData);
  //   });
  // }

};

defaultOptions = {
  type: 'view'
  // data: {}
  // bindings: {}
};

// define create and extend methods
create = sce.create.bind(null, prototype, defaultOptions);
extend = sce.extend.bind(null, create);

module.exports = {
  create: create,
  extend: extend
};
