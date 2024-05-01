import type Docker from "dockerode";

export const codeConfig = {
  python: {
    image: "python:3.9-slim",
    cmd: ["python", "-c"],
  },
  javascript: {
    image: "node:14-slim",
    cmd: ["node", "-e"],
  },
  ruby: {
    image: "ruby:3.0-slim",
    cmd: ["ruby", "-e"],
  },
};

export const cfg: Docker.ContainerCreateOptions = {
  NetworkDisabled: true,
  Tty: true,
  AttachStdin: true,
  AttachStdout: true,
  AttachStderr: true,
  OpenStdin: true,
  StdinOnce: false,
  HostConfig: {
    Memory: 150000000, // 150 MB
    NetworkMode: "none",
    MemorySwap: 150000000, // 150 MB
    DiskQuota: 0,
    IpcMode: "private",
    CpuPercent: 20, // 20% of CPU
    CapDrop: ["ALL"],
    AutoRemove: true,
    ReadonlyRootfs: true,
    Privileged: false,
  },
  ArgsEscaped: true,
};
