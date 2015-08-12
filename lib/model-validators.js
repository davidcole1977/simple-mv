'use strict';

/**
 * Creates and exports a validator list that will be shared by all models
 */
 
var sv = require('./simple-validation'),
    modelValidatorList = sv.create();

module.exports = modelValidatorList;
