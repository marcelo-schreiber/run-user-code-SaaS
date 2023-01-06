import express from "express";
import type { Express } from "express";
import { runCodeController } from "./controllers/run-code-controller";

const app: Express = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.post("/", runCodeController);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
