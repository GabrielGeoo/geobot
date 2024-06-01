import * as fs from "fs";
import path from "path";

export default function getFiles(dir: string, extensions: string | null | string[] = ["ts", "js"], complete = true, recursive = true): string[] {
  const fileNames: string[] = [];
  if (typeof extensions == "string") extensions = [extensions];

  try {
    const files = fs.readdirSync(dir, { withFileTypes: true });
    files.forEach(file => {
      if (file.isDirectory()) {
        fileNames.push(...getFiles(path.join(dir, file.name), extensions, complete, recursive));
      } else if (extensions == null || extensions.some(extension => file.name.endsWith(extension))) {
        if (complete) fileNames.push(path.join(dir, file.name));
        else fileNames.push(file.name);
      }
    });
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error);
  }

  return fileNames;
}
