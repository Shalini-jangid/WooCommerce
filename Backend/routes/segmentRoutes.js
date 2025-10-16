import express from "express";
import { evaluateSegment } from "../controllers/segmentController.js";
const router = express.Router();

router.post("/evaluate", evaluateSegment);

export default router;
