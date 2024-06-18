import * as fs from "fs";
import path from "path";

export default function getFiles(dir: string, options: { extensions?: string | string[] | null, complete?: boolean, recursive?: boolean } = {}): string[] {
  const fileNames: string[] = [];
  if (options.recursive == null) options.recursive = true;
  if (options.complete == null) options.complete = true;
  if (typeof options.extensions == "string") options.extensions = [options.extensions];
  const extensions = options.extensions as string[];

  try {
    const files = fs.readdirSync(dir, { withFileTypes: true });
    files.forEach(file => {
      if (file.isDirectory()) {
        fileNames.push(...getFiles(path.join(dir, file.name), { extensions: extensions, complete: options.complete, recursive: options.recursive }));
      } else if (options.extensions == null || extensions.some(extension => file.name.endsWith(extension))) {
        if (options.complete) fileNames.push(path.join(dir, file.name));
        else fileNames.push(file.name);
      }
    });
  } catch (error) {
    return [];
  }

  return fileNames;
}
