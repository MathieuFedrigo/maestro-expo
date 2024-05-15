import execa from "execa";

export const sendToMaestroCloud = async ({
  appPath,
  maestroTestsDirectory,
  apiKey,
  iosUpdateId,
  androidUpdateId,
  async,
  tags,
  branch,
  repoOwner,
  repoName,
  pullRequestId,
  commitSha,
  name,
}: {
  appPath: string;
  maestroTestsDirectory: string;
  apiKey?: string;
  iosUpdateId?: string;
  androidUpdateId?: string;
  async?: boolean;
  tags?: string;
  branch?: string;
  repoOwner?: string;
  repoName?: string;
  pullRequestId?: string;
  commitSha?: string;
  name?: string;
}) => {
  console.log("Running Maestro Cloud command with", {
    appPath,
    maestroTestsDirectory,
    apiKey,
    iosUpdateId,
    androidUpdateId,
    async,
    tags,
    branch,
    repoOwner,
    repoName,
    pullRequestId,
    commitSha,
    name,
  });
  const args = ["cloud"];
  if (async) args.push("--async");
  if (apiKey) args.push("--apiKey", apiKey);
  if (tags) args.push(`--include-tags=${tags}`);
  if (branch) args.push("--branch", branch);
  if (repoOwner) args.push("--repoOwner", repoOwner);
  if (repoName) args.push("--repoName", repoName);
  if (pullRequestId) args.push("--pullRequestId", pullRequestId);
  if (commitSha) args.push("--commitSha", commitSha);
  if (name) args.push("--name", name);
  if (iosUpdateId) args.push("-e", `IOS_UPDATE_ID=${iosUpdateId}`);
  if (androidUpdateId) args.push("-e", `ANDROID_UPDATE_ID=${androidUpdateId}`);
  args.push("--app-file", appPath);
  args.push("--flows", maestroTestsDirectory);

  await execa("maestro", args);
};
