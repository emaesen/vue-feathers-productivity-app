const assert = require('assert');
const app = require('../../src/app');

describe('\'reminders\' service', () => {
  it('registered the service', () => {
    const service = app.service('reminders');

    assert.ok(service, 'Registered the service');
  });
});
