import request from 'supertest';
import { describe, it, beforeEach, afterEach } from 'mocha';
import { expect } from 'chai';
import JWT from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import app from '../server.js';
import userModel from '../models/userModel.js';

const account = {
  name: 'Security Test', email: 'security@example.invalid', phone: '1234567890',
  address: 'Test address', password: 'valid-test-password',
};
const userId = '507f1f77bcf86cd799439011';
const testSecret = 'test-only-secret-that-is-at-least-32-bytes';

describe('Security regression tests', () => {
  let originalFindOne, originalSave, originalFindById, originalSecret;
  beforeEach(() => {
    originalFindOne = userModel.findOne;
    originalSave = userModel.prototype.save;
    originalFindById = userModel.findById;
    originalSecret = process.env.JWT_SECRET;
    process.env.JWT_SECRET = testSecret;
    // All database interaction must be explicitly mocked; never use a live DB.
    userModel.findOne = () => { throw new Error('Unexpected database query'); };
    userModel.prototype.save = async () => { throw new Error('Unexpected database write'); };
    userModel.findById = () => { throw new Error('Unexpected database query'); };
  });
  afterEach(() => {
    userModel.findOne = originalFindOne;
    userModel.prototype.save = originalSave;
    userModel.findById = originalFindById;
    if (originalSecret === undefined) delete process.env.JWT_SECRET;
    else process.env.JWT_SECRET = originalSecret;
  });

  it('serves the existing homepage and returns 404 for unknown routes', async () => {
    const res = await request(app).get('/').expect(200);
    expect(res.text).to.equal('This is running');
    await request(app).get('/unknown').expect(404);
  });

  it('removes the public command execution and SQL login endpoints', async () => {
    await request(app).post('/ping').send({ ip: '127.0.0.1; id' }).expect(404);
    for (const path of ['/login-test', '/login-test-2']) {
      await request(app).get(path).query({ username: "' OR 1=1 --", password: 'x' }).expect(404);
    }
  });

  it('returns malicious greeting input as plain text', async () => {
    const name = '<script>alert(document.domain)</script>';
    const res = await request(app).get('/greet').query({ name }).expect(200);
    expect(res.headers['content-type']).to.match(/^text\/plain/);
    expect(res.headers['x-content-type-options']).to.equal('nosniff');
    expect(res.text).to.equal(`Hello, ${name}`);
  });

  it('forces a normal role and excludes hashes from registration responses', async () => {
    let saved;
    userModel.findOne = async () => null;
    userModel.prototype.save = async function () { saved = this; return this; };
    const res = await request(app).post('/api/v1/auth/register').send({ ...account, role: 1 }).expect(201);
    expect(saved.role).to.equal(0);
    expect(await bcrypt.compare(account.password, saved.password)).to.equal(true);
    expect(res.body.user.role).to.equal(0);
    expect(res.body.user).not.to.have.property('password');
    expect(res.text).not.to.include(saved.password);
  });

  it('stops after detecting an existing registration', async () => {
    userModel.findOne = async () => ({ _id: userId });
    await request(app).post('/api/v1/auth/register').send(account).expect(409);
  });

  it('handles concurrent duplicate registration without leaking database errors', async () => {
    userModel.findOne = async () => null;
    userModel.prototype.save = async () => { throw Object.assign(new Error('database details'), { code: 11000 }); };
    const res = await request(app).post('/api/v1/auth/register').send(account).expect(409);
    expect(res.text).not.to.include('database details');
  });

  it('rejects missing, non-string and weak registration fields before querying', async () => {
    for (const changes of [
      { password: undefined }, { password: 'short' }, { password: 'é'.repeat(40) },
      { email: { $ne: null } }, { email: 'not-an-email' }, { name: ' ' }, { address: null },
    ]) {
      await request(app).post('/api/v1/auth/register').send({ ...account, ...changes }).expect(400);
    }
  });

  it('rejects query operator injection and missing login fields before querying', async () => {
    for (const body of [{}, { email: { $ne: null }, password: account.password }, { email: account.email, password: { $ne: null } }]) {
      await request(app).post('/api/v1/auth/login').send(body).expect(400);
    }
  });

  it('returns the same authentication failure for unknown users and wrong passwords', async () => {
    userModel.findOne = () => ({ select: async () => null });
    const absent = await request(app).post('/api/v1/auth/login').send(account).expect(401);
    const hash = await bcrypt.hash(account.password, 10);
    userModel.findOne = () => ({ select: async () => ({ password: hash }) });
    const wrong = await request(app).post('/api/v1/auth/login').send({ ...account, password: 'incorrect' }).expect(401);
    expect(absent.body).to.deep.equal(wrong.body);
  });

  it('allows valid login and returns a signed token without the password hash', async () => {
    const hash = await bcrypt.hash(account.password, 10);
    userModel.findOne = () => ({ select: async () => ({ ...account, _id: userId, role: 0, password: hash }) });
    const res = await request(app).post('/api/v1/auth/login').send(account).expect(200);
    expect(res.body.user).not.to.have.property('password');
    expect(JWT.verify(res.body.token, testSecret, { algorithms: ['HS256'] })._id).to.equal(userId);
  });

  it('hides internal database errors from authentication responses', async () => {
    const res = await request(app).post('/api/v1/auth/login').send(account).expect(500);
    expect(res.body).not.to.have.property('error');
    expect(res.text).not.to.include('Unexpected database');
  });

  it('terminates missing, invalid, expired and wrongly signed tokens with 401', async () => {
    const tokens = [null, 'invalid', JWT.sign({ _id: userId }, testSecret, { expiresIn: -1 }),
      JWT.sign({ _id: userId }, 'different-secret'), JWT.sign({ _id: 'invalid-id' }, testSecret),
      JWT.sign({ _id: userId }, testSecret, { algorithm: 'HS384' })];
    for (const token of tokens) {
      const req = request(app).get('/api/v1/auth/test');
      if (token) req.set('Authorization', `Bearer ${token}`);
      await req.expect(401);
    }
  });

  it('denies ordinary users and deleted users access to admin routes', async () => {
    const token = JWT.sign({ _id: userId }, testSecret);
    for (const user of [{ role: 0 }, null]) {
      userModel.findById = async () => user;
      await request(app).get('/api/v1/auth/test').set('Authorization', `Bearer ${token}`).expect(403);
    }
  });

  it('allows administrators with both Bearer and existing raw tokens', async () => {
    const token = JWT.sign({ _id: userId }, testSecret);
    userModel.findById = async () => ({ role: 1 });
    for (const header of [token, `Bearer ${token}`]) {
      const res = await request(app).get('/api/v1/auth/test').set('Authorization', header).expect(200);
      expect(res.text).to.equal('protected route');
    }
  });

  it('rejects malformed JSON without returning parser details', async () => {
    const res = await request(app).post('/api/v1/auth/login').set('Content-Type', 'application/json').send('{broken').expect(400);
    expect(res.body).to.deep.equal({ success: false, message: 'Invalid request body' });
  });

  it('rejects oversized request bodies', async () => {
    await request(app).post('/api/v1/auth/login').send({ email: 'x'.repeat(17000) }).expect(413);
  });

  it('defaults roles and requires sensitive fields at the model boundary', () => {
    const user = new userModel({ name: 'Test', phone: '123' });
    expect(user.role).to.equal(0);
    const errors = user.validateSync().errors;
    for (const field of ['email', 'password', 'address']) expect(errors).to.have.property(field);
    expect(userModel.schema.path('password').options.select).to.equal(false);
  });
});
