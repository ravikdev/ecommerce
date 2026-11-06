import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';

const app = express();
app.disable('x-powered-by');
app.use((req, res, next) => {
  res.set('X-Content-Type-Options', 'nosniff');
  next();
});
app.use(cors());
app.use(express.json({ limit: '16kb' }));
app.use(morgan('dev'));
app.use('/api/v1/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('This is running');
});

// Diagnostic command execution and SQL login test routes are intentionally removed.
app.get('/greet', (req, res) => {
  const name = typeof req.query.name === 'string' ? req.query.name : 'Guest';
  res.type('text/plain').send(`Hello, ${name}`);
});

// Never expose parser errors or stack traces to callers.
app.use((error, req, res, next) => {
  const status = error.status === 400 || error.status === 413 ? error.status : 500;
  res.status(status).send({ success: false, message: status === 500 ? 'Internal server error' : 'Invalid request body' });
});

export default app;
