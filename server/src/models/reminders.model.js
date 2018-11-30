const NeDB = require('nedb');
const path = require('path');

module.exports = function(app) {
  const dbPath = app.get('nedb');
  const Model = new NeDB({
    filename: path.join(dbPath, 'reminders.db'),
    timestampData: true,
    autoload: true
  });

  // schema:
  /*
  reminder: {
    _id: '',
    ownerId: user._id,
    noteId: note._id,
    text: '',
    date: '',
    time: '',
    snooze: '',
    createdAt: {},
    updatedAt: {}
  }
  */
  return Model;
};
