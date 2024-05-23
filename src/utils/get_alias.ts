import * as fs from "fs/promises";

export default async function getAlias(name: string): Promise<string[]> {
  const data = await fs.readFile("assets/data/alias.json", "utf8");
  const json = JSON.parse(data);
  return json.find((elt: any) => elt.answer === name)?.alias ?? [];
}