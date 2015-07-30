module.exports = (function () {

  function ValidatorSet (options) {
    this.validators = {};
  }

  ValidatorSet.prototype.setValidator = function (name, validator) {
    if ((arguments.length < 2) || (typeof name !== 'string') || (name.length === 0) || (typeof validator !== 'function')) {
      throw new Error('setValidator(name, validator) expects two arguments: name {string}, validator {function}');
    }

    this.validators[name] = validator;
  };

  ValidatorSet.prototype.getValidator = function (name) {
    if ((typeof name !== 'string') || (name.length === 0)) {
      throw new Error('getValidator(name) expects one arguments: name {string}');
    }

    if (typeof this.validators[name] !== 'undefined') {
      return this.validators[name];
    } else {
      return null;
    }
  };

  return {
    ValidatorSet: ValidatorSet
  };

}());
