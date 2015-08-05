'use strict';

var sh = require('./simple-helpers'),
    _ = require('lodash'),
    validatorList,
    validatorOptionsTemplate = {
      name: 'foo',
      isValid: function () {},
      message: 'bar'
    };

validatorList = {
  set: function set (options) {
    var optionsWithoutName,
        self = this;

    if (!sh.objectsAreSimilar(options, validatorOptionsTemplate)) {
      throw new Error('set(options) expects one argument: options {validator object}');
    }

    this.validators[options.name] = {};

    optionsWithoutName = _.cloneDeep(options);
    delete optionsWithoutName.name;

    _.forOwn(optionsWithoutName, function (value, key) {
      self.validators[options.name][key] = value;
    });
  },

  get: function get (name) {
    if ((typeof name !== 'string') || (name.length === 0)) {
      throw new Error('get(name) expects one arguments: name {string}');
    }

    if (typeof this.validators[name] !== 'undefined') {
      return this.validators[name];
    } else {
      return null;
    }
  },

  remove: function remove (name) {
    if ((typeof name !== 'string') || (name.length === 0)) {
      throw new Error('remove(name) expects one arguments: name {string}');
    }

    delete this.validators[name];    
  },

  removeAll: function reset () {
    this.validators = {};
  },

  getAll: function getAll () {
    return this.validators;
  }
};

function create (defaults) {
  var newValidatorList;

  if (typeof defaults === 'undefined') {
    defaults = [];
  }

  if (!Array.isArray(defaults)) {
    throw new Error('create(defaults) expects a single argument: defaults {array of validator objects}');
  }

  newValidatorList = Object.create(validatorList);
  newValidatorList.validators = {};

  defaults.forEach(function (validatorOptions) {
    newValidatorList.set(validatorOptions);
  });

  return newValidatorList;
}

module.exports = {
  create: create
};
