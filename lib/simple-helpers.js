'use strict';

function bothAreObjects (object1, object2) {
  return typeof object1 === 'object' && typeof object2 === 'object';
}

function haveSameNumberOfKeys (object1, object2) {
  return Object.keys(object1).length === Object.keys(object2).length;
}

function keyTypesMatch (object1, object2) {
  var areSimilar = Object.keys(object1).every(function (key) {
    return typeof object1[key] === typeof object2[key];
  });

  return areSimilar;
}

function propertyIsUndefined (object, property) {
  return typeof object[property] === 'undefined';
}

module.exports = {
  argumentsToArray: function argumentsToArray (args) {
    var array = [],
        i;

    for (i = 0; i < args.length; i += 1) {
      array.push(args[i]);
    }

    return array;
  },

  objectsAreSimilar: function objectsAreSimilar (object1, object2) {
    return bothAreObjects(object1, object2) && haveSameNumberOfKeys (object1, object2) && keyTypesMatch(object1, object2);
  },

  overridesProps: function overridesProps (originalObj, overrideObj) {
    return !Object.keys(originalObj).every(propertyIsUndefined.bind(null, overrideObj));
  },

  isAnObject: function isAnObject (testValue) {
    return (typeof testValue === 'object') && (testValue !== null) && (!Array.isArray(testValue));
  },

  stringContainsOnlyDigits: function stringContainsOnlyDigits (string) {
    return /^[0-9]+$/.test(string);
  },

  createFilledArray: function createFilledArray (arrayLength, fillValue) {
    var filledArray = [],
        i;

    for (i = 0; i < arrayLength; i += 1) {
      filledArray.push(fillValue);
    }

    return filledArray;
  }
};
