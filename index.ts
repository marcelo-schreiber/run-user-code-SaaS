import express from "express";
import type { Express, Request, Response } from "express";

import Docker from "dockerode";
const app: Express = express();
const docker: Docker = new Docker({ timeout: 3000 });

const TIMEOUT = 3000; // 3 seconds (in milliseconds)
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.post("/", async (req: Request, res: Response) => {
  const { code } = req.body;

  if (!code) return res.status(400).json({ message: "Code is required" });

  const container = await docker.createContainer({
    Image: "python:latest",
    NetworkDisabled: true,
    Tty: true,
    Cmd: ["python", "-c", `${code}`],
    AttachStdin: true,
    AttachStdout: true,
    AttachStderr: true,
    OpenStdin: true,
    StdinOnce: false,
  });

  try {
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error("Timeout"));
      }, TIMEOUT);
    });

    await container.start();

    // input
    const streamInput = await container.attach({
      stream: true,
      stdout: false,
      stderr: true,
      stdin: true,
    });

    streamInput.write("hello, world\n");

    const streamOutput = await container.attach({
      stream: true,
      stdout: true,
      stderr: true,
      stdin: false,
    });

    let output = "";

    streamOutput.on("data", (chunk: Buffer) => {
      output += chunk.toString("utf-8");
    });

    await Promise.race([container.wait(), timeoutPromise]);

    return res.status(200).json({ message: output }); // remove null bytes from stream
  } catch (error: Error | unknown) {
    if (error instanceof Error && error.message === "Timeout") {
      await container.kill();
      return res.status(408).json({ message: "Timeout exceeded" });
    }
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  } finally {
    // list all containers and kill container
    await container.remove();
  }
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
