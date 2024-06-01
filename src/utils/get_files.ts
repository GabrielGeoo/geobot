import * as fs from "fs";
import path from "path";

export default function getFiles(dir: string, extension: string | null = "ts", complete = true, recursive = true): string[] {
  const fileNames: string[] = [];

  try {
    const files = fs.readdirSync(dir, { withFileTypes: true });
    console.log("Files found:", files);
    console.log("For directory:", dir);
    files.forEach(file => {
      if (file.isDirectory()) {
        fileNames.push(...getFiles(path.join(dir, file.name), extension, complete, recursive));
      } else if (extension == null || file.name.endsWith(`.${extension}`)) {
        if (complete) fileNames.push(path.join(dir, file.name));
        else fileNames.push(file.name);
      }
    });
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error);
  }

  console.log("Files found:", fileNames);
  return fileNames;
}
