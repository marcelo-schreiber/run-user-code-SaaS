import express from "express";
import type { Express, Request, Response } from "express";

import Docker from "dockerode";
import { rejects } from "assert";

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
      AttachStdin: true,
      AttachStdout: true,
      AttachStderr: true,
      OpenStdin: true,
      StdinOnce: false,
    });

    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(async () => {
        await container.kill();
        reject(new Error("Timeout"));
      }, TIMEOUT);
    });

    await container.start();

    const stream = await container.attach({
      stream: true,
      stdout: true,
      stdin: true,
      stderr: true,
    });

    stream.write("hello, world!\n");
    // wait for container to finish or timeout
    await Promise.race([container.wait(), timeoutPromise]);

    // get stream stdout
    const output: Buffer = await new Promise((resolve, reject) => {
      stream.on("data", (data: Buffer) => {
        resolve(data);
      });
    });

    return res
      .status(200)
      .json({ message: output.toString("utf-8").replace(/\0/g, "") }); // remove null bytes from stream
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
