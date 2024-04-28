import execa from "execa";

export const sendToMaestroCloud = async ({
  appPath,
  maestroTestsDirectory,
  apiKey,
  iosUpdateId,
  androidUpdateId,
  async,
  tags,
}: {
  appPath: string;
  maestroTestsDirectory: string;
  apiKey?: string;
  iosUpdateId?: string;
  androidUpdateId?: string;
  async?: boolean;
  tags?: string;
}) => {
  console.log("Running Maestro Cloud command with", {
    appPath,
    maestroTestsDirectory,
    apiKey,
    iosUpdateId,
    androidUpdateId,
    async,
    tags,
  });
  const args = ["cloud"];
  if (async) args.push("--async");
  if (apiKey) args.push("--apiKey", apiKey);
  if (tags) args.push(`--include-tags=${tags}`);
  if (iosUpdateId) args.push("-e", `IOS_UPDATE_ID=${iosUpdateId}`);
  if (androidUpdateId) args.push("-e", `ANDROID_UPDATE_ID=${androidUpdateId}`);
  args.push("--app-file", appPath);
  args.push("--flows", maestroTestsDirectory);

  await execa("maestro", args);
};
