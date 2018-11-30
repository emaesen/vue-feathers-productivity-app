// Initializes the `reminders` service on path `/reminders`
const createService = require('feathers-nedb');
const createModel = require('../../models/reminders.model');
const hooks = require('./reminders.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/reminders', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('reminders');

  service.hooks(hooks);
};
