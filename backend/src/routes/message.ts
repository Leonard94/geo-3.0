import express from "express";
import { getRecentMessages } from "../controllers/messages";

const router = express.Router();

router.get("/", getRecentMessages);

export default router;
