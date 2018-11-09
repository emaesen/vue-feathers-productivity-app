const NeDB = require('nedb');
const path = require('path');

module.exports = function (app) {
  const dbPath = app.get('nedb');
  const Model = new NeDB({
    filename: path.join(dbPath, 'notes.db'),
    timestampData: true,
    autoload: true
  });

  // schema:
  /*
  note: {
    _id: '',
    userId: user._id,
    text: '',
    category: '',
    createdAt: {},
    updatedAt: {}
  }
  */
  return Model;
};
