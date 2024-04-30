import { expect, test } from "vitest";

import { PORT } from "../src/index";

import "../src/index"; // runs server

test("404 check", async () => {
  const response = await fetch(`http://localhost:${PORT}/404`);

  expect(response.status).toBe(404);
});

test("run code without input", async () => {
  const response = await fetch(`http://localhost:${PORT}/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      code: "print('Hello, World!')",
    }),
  });

  const body = await response.json();

  expect(body).toMatchObject({ message: "Hello, World!\r\n" });
});

test("run code with input", async () => {
  const response = await fetch(`http://localhost:${PORT}/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      code: "print(input())",
      input: "With input!",
    }),
  });

  const body = await response.json();

  expect(body).toMatchObject({ message: "With input!\r\n" });
})