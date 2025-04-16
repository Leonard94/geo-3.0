import express from "express";
import { getRabsData } from "../controllers/rabs";

const router = express.Router();

router.get("/", getRabsData);

export default router;