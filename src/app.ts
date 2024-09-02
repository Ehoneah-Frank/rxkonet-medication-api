import express from "express";


// create an express app
const app = express();

// Middleware
app.use(express.json())

export default app;