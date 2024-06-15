import express from "express";
import cors from "cors";

import contextRouter from "./routes/context.js";

const app = express();
const port = 3000;

app.use(cors());

app.use(express.json());
app.use("/api/v1", contextRouter);
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
