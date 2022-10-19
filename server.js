import express from "express";
import dotenv from "dotenv";
import color from "colors";
import morgan from "morgan";
import connectDB from "./config/db.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";

import memoryRoutes from "./routes/memoryRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();
connectDB();

const app = express();

process.env.NODE_ENV === "development" ? app.use(morgan("dev")) : null;

app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/api/memory", memoryRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`server is running on ${PORT}`.yellow.bold));
