import express from "express";

import { errorHandler, notFound } from "./middleware/errorMiddleware.js";

import memoryRoutes from "./routes/memoryRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";

const app = express();

app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/api/memory", memoryRoutes);
app.use("/api/comment", commentRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;