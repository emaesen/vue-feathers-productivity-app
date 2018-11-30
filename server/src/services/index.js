const users = require('./users/users.service.js');
const notes = require('./notes/notes.service.js');
const reminders = require('./reminders/reminders.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(users);
  app.configure(notes);
  app.configure(reminders);
};
