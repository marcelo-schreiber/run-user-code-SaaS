import { Request, Response } from "express";
import Docker from "dockerode";

const docker: Docker = new Docker({ timeout: 3000 });
const TIMEOUT = 3000; // 3 seconds (in milliseconds)

export const runCodeController = async (req: Request, res: Response) => {
  const { code, input } = req.body;

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

    if (input && input !== "") {
      // input
      const inputs = input.split("\n");

      const streamInput = await container.attach({
        stream: true,
        stdout: false,
        stderr: true,
        stdin: true,
      });

      for (const i of inputs) {
        streamInput.write(`${i}\n`);
      }
    }

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
};
