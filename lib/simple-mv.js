module.exports = (function () {

  var Helpers = require('./simple-helpers');
      Validation = require('./simple-validation');

  function Datum (value) {
    this.value = value || null;
    this.validators = {};
  }

  // Datum.prototype.isValid = function () {

  // };

  // Datum.prototype.setValidator = function (name, validationFunction) {
  //   this.validators[name] = validationFunction;
  // };

  function Model (options) {
    this.data = {};
  }

  // Model.isValidatorLike = function (comparisonObject) {
  //   var referenceObject = {
  //         name: 'foo',
  //         validator: function () {}
  //       };

  //   return Helpers.objectsAreSimilar(referenceObject, comparisonObject);
  // };

  Model.prototype.set = function (key, value) {
    if ((typeof key !== 'string') || (key.length === 0)) {
      throw new Error('Model.set(key, value) expects two arguments, the first of which (key) should be a string');
    }

    // create if the key doesn't already exist
    if (!this.data[key]) {
      this.data[key] = new Datum(value);
    } else {
      this.data[key].value = value;
    }
  };

  Model.prototype.get = function (key) {
    if (typeof key !== 'string') {
      throw new Error('Model.get(key) expects a single string as an argument');
    } else if (!(key in this.data)) {
      throw new Error('Model.get(key) there is no parameter with the specified key');
    }

    return this.data[key].value;
  };

  Model.prototype.delete = function (key) {
    if (typeof key !== 'string') {
      throw new Error('Model.delete(key) expects a single string as an argument');
    }
    delete this.data[key];
  };

  // Model.prototype.setValidators = function (key, validators) {
  //   var validatorArray,
  //       self = this;

  //   if ((arguments.length < 2) || (typeof key !== 'string') || (Array.isArray(validators) && !validators.every(Model.isValidatorLike)) || (!Array.isArray(validators) && !Model.isValidatorLike(validators))) {
  //     throw new Error('Model.addValidators(key, validators) expects two arguments: key {string}, validators {validator object or array of validator objects}');
  //   }
  //   if (!(key in this.data)) {
  //     throw new Error('there is no parameter with the specified key');
  //   }

  //   validatorArray = Array.isArray(validators) ? validators : [validators];

  //   validatorArray.forEach(function(validatorObj) {
  //     self.data[key].setValidator(validatorObj.name, validatorObj.validator);
  //   });
  // };

  return {
    Model: Model
  };

}());