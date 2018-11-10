const { authenticate } = require('@feathersjs/authentication').hooks;
const hooks = require('feathers-authentication-hooks');

module.exports = {
  before: {
    all: [
      authenticate('jwt'),
      hooks.restrictToOwner({
        ownerField: 'ownerId'
      })
    ],
    find: [],
    get: [],
    create: [
      hooks.associateCurrentUser({
        as: 'ownerId'
      })
    ],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
