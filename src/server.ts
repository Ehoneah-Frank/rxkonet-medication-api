import app from "./app";
import dbConnection from "./config/db";
import dotenv from "dotenv";
dotenv.config();


const port = process.env.PORT || 3000;

// Connect Database
dbConnection();

// Enforce HTTPS in production
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.headers['x-forwarded-proto'] !== 'https') {
      return res.redirect(`https://${req.headers.host}${req.url}`);
    }
    next();
  });
}

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});