import { cfg as SETTINGS } from "./utils/createContainerConfig";
import Docker from "dockerode";
import express from "express";
import { rateLimit } from "express-rate-limit";

const TIMEOUT = 3000; // 3 seconds (in milliseconds)
export const PORT = process.env.PORT || 3000;

const limiter = rateLimit({
  windowMs: 30 * 1000, // 30 seconds
  max: 3, // limit each IP to 3 requests per windowMs
  standardHeaders: 'draft-7',
  legacyHeaders: false,
})

const docker: Docker = new Docker();
const app = express();

app.use(limiter);
app.use(express.json());

app.post("/", async (request, response) => {
  const { code, input } = request.body;

  if (!code) {
    return response.status(400).json({ message: "Code is required" });
  }

  const container = await docker.createContainer({
    ...SETTINGS, // default container settings and quotas
    Cmd: ["python", "-c", `${code}`],
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
      await container.stop();
      await container.remove();
    } catch (e) {}
  }
});

app.use("*", (_, response) => {
  response.status(404).json({ message: "Not Found" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
