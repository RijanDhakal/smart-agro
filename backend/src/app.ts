import express, { urlencoded } from "express";
import path from "path";
import cors from "cors";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);

// Route import
const ApiVersion = "/api/v1";
import userRouter from "./router/user.route";
import productRouter from "./router/products.route";

// router declaration
app.use(`${ApiVersion}/users`, userRouter);
app.use(`${ApiVersion}/products`, productRouter);

// Serve frontend build
const root = process.cwd();
app.use(express.static(path.join(root, "frontend-dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(root, "frontend-dist", "index.html"));
});

export default app;
