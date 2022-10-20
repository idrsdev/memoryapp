import dotenv from "dotenv";
import color from "colors";
import morgan from "morgan";
import connectDB from "./config/db.js";

import app from "./app.js";

dotenv.config();
connectDB();

process.env.NODE_ENV === "development" ? app.use(morgan("dev")) : null;

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`server is running on ${PORT}`.yellow.bold));
