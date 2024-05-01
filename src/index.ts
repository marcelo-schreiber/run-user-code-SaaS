import express from "express";
import { rateLimit } from "express-rate-limit";
import { runCode } from "./routes/run-code";

export const PORT = process.env.PORT || 3000;

const limiter = rateLimit({
  windowMs: 60 * 1000, // 60 seconds or 1 minute
  max: 15, // limit each IP to 7 requests per windowMs
  standardHeaders: "draft-7",
  legacyHeaders: false,
});

const app = express();

app.use(limiter);
app.use(express.json());
app.post("/run/:lang", runCode);

app.use("*", (_, response) => {
  response.status(404).json({ message: "Not Found" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
