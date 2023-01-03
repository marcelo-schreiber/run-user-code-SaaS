import express from "express";
import type { Express, Request, Response } from "express";

import Docker from "dockerode";

const app: Express = express();
const docker: Docker = new Docker({ timeout: 3000 });

const TIMEOUT = 3000; // 3 seconds (in milliseconds)
const PORT = process.env.PORT || 8090;

app.use(express.json());

app.post("/", async (req: Request, res: Response) => {
  try {
    const { code } = req.body;

    if (!code) return res.status(400).json({ message: "Code is required" });

    const container = await docker.createContainer({
      Image: "python:latest",
      NetworkDisabled: true,
      Tty: true,
      Cmd: ["python", "-c", `${code}`],
    });

    const timeout = new Promise((_, reject) => {
      setTimeout(async () => {
        await container.kill();
        reject(new Error("Timeout"));
      }, TIMEOUT);
    });

    await container.start();

    // wait for container to finish or timeout
    await Promise.race([container.wait(), timeout]);

    const stream = await container.logs({
      stdout: true,
      stderr: true,
      tail: 100,
    });

    return res
      .status(200)
      .json({ message: stream.toString("utf-8").replace(/\0/g, "") }); // remove null bytes from stream
  } catch (error: Error | any) {
    if (error.message === "Timeout")
      return res.status(408).json({ message: "Timeout exceeded" });
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
