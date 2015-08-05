'use strict';

function argumentsToArray (args) {
  var array = [],
      i;

  for (i = 0; i < args.length; i += 1) {
    array.push(args[i]);
  }

  return array;
}

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

function objectsAreSimilar (object1, object2) {
  return bothAreObjects(object1, object2) && haveSameNumberOfKeys (object1, object2) && keyTypesMatch(object1, object2);
}

module.exports = {
  argumentsToArray: argumentsToArray,
  objectsAreSimilar: objectsAreSimilar
};