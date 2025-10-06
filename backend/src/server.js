import { createServer } from "http"; 
import connectToDB from "./utils/database/db.js";
 


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
