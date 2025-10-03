import express, { Request, Response } from "express";

const app = express();
const PORT = 3000;

// Middleware to parse JSON
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello from Express + TypeScript 🚀");
});

app.listen(PORT, () => {
  console.log(`Server is running  on PORT : ${PORT}`);
});
