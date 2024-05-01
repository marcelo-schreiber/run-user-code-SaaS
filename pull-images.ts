import { execSync } from "node:child_process";
import { codeConfig } from "./src/utils/createContainerConfig";

async function pullImages() {
  let key: keyof typeof codeConfig;

  for (key in codeConfig) {
    const image = codeConfig[key].image;
    try {
      execSync(`docker pull ${image}`);
      console.log(`Pulled image: ${image}`);
    } catch (error) {
      console.error(`Error pulling image: ${image}`, error);
    }
  }
}

pullImages();
// Path: pull-images.js
