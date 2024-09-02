import app from "./app";
import dbConnection from "./config/db";

const port = process.env.PORT || 3000;

// Connect Database
dbConnection();

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});