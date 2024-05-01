import { $ } from "bun";

import { codeConfig } from "./src/utils/createContainerConfig";

async function pullImages() {
  let key: keyof typeof codeConfig;

  for (key in codeConfig) {
    const image = codeConfig[key].image;
    try {
      await $`docker pull ${codeConfig[key].image}`;
    } catch (error) {
      console.error(`Error pulling image: ${image}`, error);
    }
  }
}

pullImages();
// Path: pull-images.ts
