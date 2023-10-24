//Import Dependencies Modules
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import helmet from "helmet";
import path from "path";
//Import Custom Modules
import { connectDB } from "./config/connectDB.js";
connectDB();
import { authRoutes } from "./routes/authRoutes.js";
import { userRoutes } from "./routes/userRoutes.js";
import { postRoutes } from "./routes/postRoutes.js";
//Create Local Environment Server
const app = express();
const PORT = process.env.PORT || 8800;

const __dirname = path.resolve();
//Third Party Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(helmet());
//Routes
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/post", postRoutes);

app.use(express.static(path.join(__dirname, "/client/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

//Deploy Server
app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});
