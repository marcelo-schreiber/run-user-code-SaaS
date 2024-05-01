import { $ } from "bun";

import { codeConfig } from "./src/utils/createContainerConfig";

for (const key in codeConfig) {
  const image = codeConfig[key].image;
  try {
    await $`docker pull ${codeConfig[key].image}`;
  } catch (error) {
    console.error(`Error pulling image: ${image}`, error);
  }
}

// Path: pull-images.js
