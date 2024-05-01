import type { Request, Response } from "express";
import Docker from "dockerode";
import { cfg as SETTINGS, codeConfig } from "../utils/createContainerConfig";

const docker: Docker = new Docker();

const TIMEOUT = 3000; // 3 seconds (in milliseconds)

export async function runCode(request: Request, response: Response) {
  const { lang } = request.params;
  const { code, input } = request.body;

  if (!code) {
    return response.status(400).json({ message: "Code is required" });
  }

  if (Object.keys(codeConfig).includes(lang) === false) {
    return response
      .status(400)
      .json({
        message: `Language not supported. The languages supported are: ${Object.keys(
          codeConfig
        ).join(", ")}`,
      });
  }

  if (code.length > 1000) {
    return response
      .status(400)
      .json({ message: "Code length must be less than 1000 characters" });
  }

  const container = await docker.createContainer({
    ...SETTINGS, // default container settings and quotas
    Image: codeConfig[lang as keyof typeof codeConfig].image, // default image
    Cmd: [...codeConfig[lang as keyof typeof codeConfig].cmd, code], // default command
  });

  try {
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error("Timeout"));
      }, TIMEOUT);
    });

    await container.start();

    if (input && input !== "") {
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

    return response.status(200).json({ message: output });
  } catch (error: Error | unknown) {
    if (error instanceof Error && error.message === "Timeout") {
      return response
        .status(408)
        .json({ message: `Timeout of ${TIMEOUT} exceeded` });
    }

    console.error(error);

    return response.status(500).json({ message: "Internal Server Error" });
  } finally {
    try {
      // prevent memory leaks
      await container.kill();
      await container.stop();
      await container.remove();
    } catch (e) {}
  }
}
