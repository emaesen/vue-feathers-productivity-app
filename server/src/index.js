/* eslint-disable no-console */
const logger = require('./logger');
const app = require('./app');
const port = app.get('port');
const server = app.listen(port);

const options = { dateStyle: "short", timeStyle: "short" };
const now = (new Date()).toLocaleString('en-US', options) 

process.on('unhandledRejection', (reason, p) =>
  logger.error(now + ' - Unhandled Rejection at: Promise ', p, reason)
);

server.on('listening', () =>
  logger.info(now + ' - Feathers application started on http://%s:%d', app.get('host'), port)
);
