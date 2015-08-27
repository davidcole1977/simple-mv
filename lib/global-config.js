'use strict';

module.exports = {

  EVENTS: {
    MODEL: {
      CREATE: 'create-model',
      DESTROY: 'destroy-model',
      DATUM_CREATE: 'create-datum',
      DATUM_UPDATE: 'update-datum',
      DATUM_REMOVE: 'remove-datum'
    },
    COLLECTION: {
      CREATE: 'create-collection',
      DESTROY: 'destroy-collection',
      MEMBER_ADD: 'add-member',
      MEMBER_UPDATE: 'update-member',
      MEMBER_REMOVE: 'remove-member'
    },
    VIEW: {
      CREATE: 'create-view',
      DESTROY: 'destroy-view',
      BOUND_DATA_CREATE: 'create-bound-data',
      BOUND_DATA_UPDATE: 'update-bound-data',
      BOUND_DATA_REMOVE: 'remove-bound-data'
    },
    SAVER: {
      CREATE: 'create-saver',
      DESTROY: 'destroy-saver',
      REQUEST_SEND: 'request-save',
      RESPONSE_SUCCESS: 'successful-save',
      RESPONSE_ERROR: 'error-save'
    },
    FETCHER: {
      CREATE: 'create-fecther',
      DESTROY: 'destroy-fecther',
      REQUEST_SEND: 'request-fetch',
      RESPONSE_SUCCESS: 'successful-fetch',
      RESPONSE_ERROR: 'error-fetch'
    },
    COMPONENT: {
      CREATE: 'create-component',
      DESTROY: 'destroy-component'
    }
  }

};
