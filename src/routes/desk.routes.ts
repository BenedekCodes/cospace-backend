import { Router } from "express";
import { DeskController } from "../controllers/desk.controller";
import { auth } from "../middleware/auth";
import { validateSchema } from "../middleware/validate";
import { createDeskSchema } from "../schemas/desk.schema";

const router = Router();
const controller = new DeskController();

router.get("/", (req, res, next) => controller.getAll(req, res, next));
router.post("/", auth, validateSchema(createDeskSchema), (req, res, next) =>
  controller.create(req, res, next));

export default router;
