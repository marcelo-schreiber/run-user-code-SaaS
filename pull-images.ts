import { $ } from "bun";

import { codeConfig } from "./src/utils/createContainerConfig";

let key: keyof typeof codeConfig;

for (key in codeConfig) {
  const image = codeConfig[key].image;
  try {
    $`docker pull ${codeConfig[key].image}`;
  } catch (error) {
    console.error(`Error pulling image: ${image}`, error);
  }
}

// Path: pull-images.ts
