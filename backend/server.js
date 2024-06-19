import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import contextRouter from "./routes/context.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.use(express.json());
app.use("/api/v1", contextRouter);
app.listen(PORT, () => {
	console.log(`Server running`);
});
