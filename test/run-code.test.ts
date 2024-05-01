import { expect, test } from "vitest";
import { PORT } from "../src/index";

import "../src/index"; // runs server

test("404 check", async () => {
  const response = await fetch(`http://localhost:${PORT}/404`);

  expect(response.status).toBe(404);
});

test("run python code without input", async () => {
  const response = await fetch(`http://localhost:${PORT}/run/python`, {
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

test("run python code with input", async () => {
  const response = await fetch(`http://localhost:${PORT}/run/python`, {
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
});

test("run javascript code without input", async () => {
  const response = await fetch(`http://localhost:${PORT}/run/javascript`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      code: "console.log('Hello, World!')",
    }),
  });

  const body = await response.json();

  expect(body).toMatchObject({ message: "Hello, World!\r\n" });
});

test("run ruby code without input", async () => {
  const response = await fetch(`http://localhost:${PORT}/run/ruby`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      code: "puts 'Hello, World!'",
    }),
  });

  const body = await response.json();

  expect(body).toMatchObject({ message: "Hello, World!\r\n" });
});

test("run unsupported language", async () => {
  const response = await fetch(`http://localhost:${PORT}/run/unsupported`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      code: "print('Hello, World!')",
    }),
  });

  const body = await response.json();

  expect(body.message).toContain(
    "Language not supported. The languages supported are"
  );
});

test("code timeout", async () => {
  const response = await fetch(`http://localhost:${PORT}/run/python`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      code: "while True: pass",
    }),
  });

  const body = await response.json();

  expect(body.message).toContain("Timeout");
});
