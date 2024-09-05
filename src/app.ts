import express from 'express';
import medicationRouter from './routes/medicationRoute';
import searchRouter from './routes/searchRoute';
import bulkRouter from './routes/bulkRoute';

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api', bulkRouter);
app.use('/api', medicationRouter);
app.use('/api', searchRouter);


// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.status(404).json({ error: 'Not Found' });
});

export default app;