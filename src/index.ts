import express, { Request, Response } from "express";
import bookingsRouter from "./routes/booking.routes";

const app = express();
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ status: "active", message: "CoSpace API is running" });
});

app.use("/bookings", bookingsRouter);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});

process.on("SIGTERM", () => process.exit(0));
process.on("SIGINT", () => process.exit(0));

export default app;

