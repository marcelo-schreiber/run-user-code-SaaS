import type Docker from "dockerode";

export const cfg: Docker.ContainerCreateOptions = {
  Image: "python:latest",
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
    CpuPercent: 25, // 25% of CPU
    CpuQuota: 100000 / 4, // 25% of CPU
    CapDrop: ["ALL"],
    AutoRemove: true,
    ReadonlyRootfs: true,
    Privileged: false,
  },
};
