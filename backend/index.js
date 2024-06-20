import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import contextRouter from "./routes/context.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
	cors({
		origin: [
			"https://main--law-gpt.netlify.app",
			"https://law-gpt.netlify.app",
		],
		methods: ["GET", "POST"],
	})
);

app.use(express.json());
app.use("/api/v1", contextRouter);
app.listen(PORT, () => {
	console.log(`Server running`);
});
