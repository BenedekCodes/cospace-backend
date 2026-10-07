require('dotenv').config();

import { auth } from "./middleware/auth";
import { ForbiddenError } from "./errors";
import express, { Request, Response } from "express";
import cors from "cors";
import bookingsRouter from "./routes/booking.routes";
import desksRouter from "./routes/desk.routes";
import { logger } from "./middleware/logger";
import { errorHandler } from "./middleware/errorHandler";
import { HttpStatus } from "./constants/httpStatus";

const app = express();
app.use(express.json());
app.use(logger);
app.use(cors({ origin: "http://localhost:3000" }));

app.get("/", (req: Request, res: Response) => {
  res.status(HttpStatus.OK).json({ status: "active", message: "CoSpace API is running" });
});

app.use("/bookings", bookingsRouter);
app.use("/desks", desksRouter);

app.use(errorHandler);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});

app.get("/boom-forbidden", () => {
   throw new ForbiddenError("You do not have permission to access this resource");
});

process.on("SIGTERM", () => process.exit(0));
process.on("SIGINT", () => process.exit(0));

export default app;
