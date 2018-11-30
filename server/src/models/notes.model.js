const NeDB = require('nedb');
const path = require('path');

module.exports = function(app) {
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
    ownerId: user._id,
    text: '',
    category: '',
    color: '',
    createdAt: {},
    updatedAt: {}
  }
  */
  return Model;
};
