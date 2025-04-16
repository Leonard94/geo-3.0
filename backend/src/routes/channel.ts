import express from "express";
import {
  getAllChannels,
  getChannel,
  createChannel,
  updateChannel,
  deleteChannel,
} from "../controllers/channels";

const router = express.Router();

router.get("/", getAllChannels);
router.get("/:id", getChannel);
router.post("/", createChannel);
router.put("/:id", updateChannel);
router.delete("/:id", deleteChannel);

export default router;
