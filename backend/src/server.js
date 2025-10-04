import dotenv from "dotenv";
import { dirname } from "path";
import { fileURLToPath } from "url";
import path from "path";
import { createServer } from "http"; 
import connectToDB from "./utils/database/db.js";
 
// Get the root directory
const __dirname = dirname(fileURLToPath(import.meta.url));

// Load environment variables from .env file
dotenv.config({
  path: path.resolve(__dirname, "../.env"), // Go up one level to find the .env file
});  
 


import { app } from "./app.js";



const server = createServer(app);


// Define the server port
const port = process.env.PORT || 8000;


// Define a basic API route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// health checkup route
app.get("/health", (req, res) => {
  res.send("Hello World!");
});

// Start the server and connect to the database
server.listen(port, async () => {
  await connectToDB(); 
  console.log(`Server is running on port ${port}`);
});
