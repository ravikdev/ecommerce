const request = require('supertest');
const app = require('./app');

describe('GET /', () => {
  it('returns "This is running"', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toBe('This is running');
  });
});
