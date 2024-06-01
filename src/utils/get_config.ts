import * as fs from "fs/promises";

let config: any;

export default async function getConfig() {
  if (!config) {
    const data = await fs.readFile('./assets/config.json', "utf8");
    config = JSON.parse(data);
  }
  return config;
}