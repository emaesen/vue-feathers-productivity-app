// Initializes the `events` service on path `/events`
const createService = require('feathers-nedb');
const createModel = require('../../models/events.model');
const hooks = require('./events.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/events', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('events');

  service.hooks(hooks);
};
