import dotenv from 'dotenv';
dotenv.config();


import express from 'express';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import helmet from 'helmet';
import medicationRouter from './routes/medicationRoute';
import searchRouter from './routes/searchRoute';
import bulkRouter from './routes/bulkRoute';
import identifierRouter from './routes/identifierRoute';
import manufacturerRouter from './routes/manufacturerRoute';
import codingRouter from './routes/codingRoute';
import expressOasGenerator from 'express-oas-generator';
import mongoose from 'mongoose';








// create an express app
const app = express();

app.use(cors({
  origin: '*',
  credentials: true
}));
expressOasGenerator.handleResponses(app, {
  alwaysServeDocs: true,
  tags: ['Medications', 'Identifiers', 'Manufacturers', 'Codings'],
  mongooseModels: mongoose.modelNames(),
  specOutputFileBehavior: 'RECREATE',
  swaggerDocumentOptions: {}
});

// Security middlewares
app.use(helmet());
app.use(cors({credentials: true, origin: '*'}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

// Middleware
app.use(express.json());



// Routes
app.use('/api/v1', bulkRouter);
app.use('/api/v1', searchRouter);
app.use('/api/v1', medicationRouter);
app.use('/api/v1', identifierRouter);
app.use('/api/v1', manufacturerRouter);
app.use('/api/v1', codingRouter)
expressOasGenerator.handleRequests();
app.use((req, res) => res.redirect('/api-docs/'));

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