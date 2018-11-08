const NeDB = require('nedb');
const path = require('path');

module.exports = function (app) {
  const dbPath = app.get('nedb');
  const Model = new NeDB({
    filename: path.join(dbPath, 'users.db'),
    timestampData: true,
    autoload: true
  });

  Model.ensureIndex({ fieldName: 'username', unique: true }, function(err){
    // handle errors...
    // err.errorType, err.key, err.message
  });

  return Model;
};
