import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import surveysRoutes from "./routes/surveys.routes";
import responsesRoutes from "./routes/responses.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/surveys", surveysRoutes);
app.use("/api/responses", responsesRoutes);

export default app;
