import * as fs from "fs";
import path from "path";

export default function getFiles(dir: string, extension: string | null = "ts", complete = true, recursive = true): string[] {
  const fileNames: string[] = [];

  fs.readdirSync(dir, {withFileTypes: true, recursive: recursive}).forEach(file => {
    if (file.isDirectory()) {
      fileNames.push(...getFiles(path.join(dir, file.name), extension, complete, recursive));
    } else if (extension == null || file.name.endsWith(`.${extension}`)) {
      if (complete) fileNames.push(path.join(dir, file.name));
      else fileNames.push(file.name);
    }
  });

  return fileNames;
}