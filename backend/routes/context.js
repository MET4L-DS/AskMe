import express from "express";
import { getContext } from "../controllers/context.js";
import { getGeminiResponse } from "../controllers/geminiController.js";

const router = express.Router();

router.get("/context", (req, res) => {
    res.json({ msg: "Context Server is running!" });
});

router.post("/context", getContext);
router.post("/gemini", getGeminiResponse);

export default router;