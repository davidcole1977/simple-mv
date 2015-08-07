'use strict';

var sh = require('./simple-helpers'),
    sv = require('./simple-validation'),
    _ = require('lodash'),
    model;

model = {
  set: function set (key, value) {
    if ((typeof key !== 'string') || (key.length === 0)) {
      throw new Error('set(key, value) expects two arguments, the first of which (key) should be a string');
    }

    // create if the key doesn't already exist
    if (!this.data[key]) {
      this.data[key] = {
        value: _.cloneDeep(value) || null,
        validators: {}
      };
    } else {
      this.data[key].value = _.cloneDeep(value);
    }
  },

  get: function get (key) {
    if (typeof key !== 'string') {
      throw new Error('get(key) expects a single string as an argument');
    } else if (!(key in this.data)) {
      throw new Error('get(key) there is no parameter with the specified key');
    }

    return _.cloneDeep(this.data[key].value);
  },

  remove: function remove (key) {
    if (typeof key !== 'string') {
      throw new Error('delete(key) expects a single string as an argument');
    }
    delete this.data[key];
  },

  getRawData: function getRawData () {
    var rawData = {};

    _.forOwn(this.data, function (datum, key) {
      rawData[key] = _.cloneDeep(datum.value);
    });

    return rawData;
  }
};

function create () {
  var newModel;

  newModel = Object.create(model);
  newModel.data = {};

  return newModel;
}

module.exports = {
  create: create
};
