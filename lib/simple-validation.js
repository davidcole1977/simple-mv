var validatorList;

validatorList = {
  set: function set (name, validator) {
    if ((arguments.length < 2) || (typeof name !== 'string') || (name.length === 0) || (typeof validator !== 'function')) {
      throw new Error('set(name, validator) expects two arguments: name {string}, validator {function}');
    }

    this.validators[name] = validator;
  },

  get: function get (name) {
    return 'foobar';
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
  if (typeof defaults === 'undefined') {
    defaults = {};
  }

  if (Array.isArray(defaults) || (typeof defaults !== 'object')) {
    throw new Error('create(defaults) expects a single argument: defaults {object containing default validators}');
  }

  var newValidatorList = Object.create(validatorList);

  newValidatorList.validators = {};

  Object.keys(defaults).forEach(function (key) {
    newValidatorList.set(key, defaults[key]);
  });

  return newValidatorList;
}

module.exports = {
  create: create
};
