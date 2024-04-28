import execa from "execa";
import os from "node:os";
import path from "node:path";

export const downloadFile = async (url: string) => {
  console.log("Downloading file from ", url);
  const archiveName = url.split("/").pop();

  if (!archiveName)
    throw new Error(`Could not parse archive name from url ${url}`);

  const tmpPath = path.join(os.tmpdir(), archiveName);

  await execa("curl", ["-L", url, "-o", tmpPath]);

  return tmpPath;
};
