// Initializes the `notes` service on path `/notes`
const createService = require('feathers-nedb');
const createModel = require('../../models/notes.model');
const hooks = require('./notes.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/notes', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('notes');

  service.hooks(hooks);
};
