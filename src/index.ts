import express, { Request, Response } from "express";

const app = express();

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ status: "active", message: "CoSpace API is running" });
});

const server = app.listen(5000, () => {
  console.log("Server running on port 5000");
});

const shutdown = () => {
  server.close(() => process.exit(0));
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

export default app;