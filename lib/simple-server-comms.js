'use strict';

var sh = require('./simple-helpers'),
    _ = require('lodash');

module.exports = {

  save: function save (saver) {
    if (typeof saver === 'function') {
      saver();
    } else if (typeof this.saver === 'function') {
      this.saver();
    }
  },

  fetch: function fetch (fetcher) {
    if (typeof fetcher === 'function') {
      fetcher();
    } else if (typeof this.fetcher === 'function') {
      this.fetcher();
    }
  }

};