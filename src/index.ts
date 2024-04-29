import "@bogeychan/elysia-polyfills/node/index.js";

import { Elysia, t } from "elysia";
import { cfg as SETTINGS } from "./utils/createContainerConfig";
import Docker from "dockerode";

const TIMEOUT = 3000; // 3 seconds (in milliseconds)

const docker: Docker = new Docker();

const app = new Elysia()
  .post(
    "/",
    async ({ body, set }) => {
      const { code, input } = body;

      if (!code) {
        set.status = 400;
        return { message: "Code is required" };
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

        set.status = 200;
        return { message: output };
      } catch (error: Error | unknown) {
        if (error instanceof Error && error.message === "Timeout") {
          set.status = 408;
          return { message: `Timeout of ${TIMEOUT} exceeded` };
        }

        console.error(error);

        set.status = 500;
        return { message: "Internal Server Error" };
      } finally {
        try {
          // prevent memory leaks
          await container.stop();
          await container.remove();
        } catch (e) {
          console.error(e);
        }
      }
    },
    {
      body: t.Object({
        code: t.String(),
        input: t.Optional(t.String()),
      }),
    }
  )
  .listen(3000);

console.info(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
