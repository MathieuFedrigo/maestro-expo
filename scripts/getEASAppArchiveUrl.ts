import execa from "execa";
import { z } from "zod";

const easListSchema = z.array(
  z.object({
    buildProfile: z.string(),
    artifacts: z.object({
      applicationArchiveUrl: z.string(),
    }),
    expirationDate: z.string(),
  })
);
export type Build = z.infer<typeof easListSchema>[0];

type Config = {
  platform: "ios" | "android";
  appIdentifier: string;
  buildProfile: string;
};

const filterOutExpiredBuilds = (builds: Build[]) => {
  const now = new Date();
  return builds.filter((build) => {
    const expirationDate = new Date(build.expirationDate);
    return expirationDate > now;
  });
};

export const getEASAppArchiveUrl = async ({
  platform,
  appIdentifier,
  buildProfile,
}: Config) => {
  console.log("Getting EAS app archive URL", {
    platform,
    appIdentifier,
    buildProfile,
  });
  const { stdout } = await execa("eas", [
    "build:list",
    "--status=finished",
    platform === "ios" ? "--simulator" : "--distribution=internal",
    `--platform=${platform}`,
    `--appIdentifier=${appIdentifier}`,
    `--buildProfile=${buildProfile}`,
    "--json",
    "--non-interactive",
  ]);

  const builds = easListSchema.parse(JSON.parse(stdout));

  if (!builds || builds.length === 0)
    throw new Error(
      `No build found on EAS for platform ${platform}, appIdentifier ${appIdentifier} and buildProfile ${buildProfile}`
    );

  const nonExpiredBuilds = filterOutExpiredBuilds(builds);

  if (nonExpiredBuilds.length === 0)
    throw new Error(
      `All build for platform ${platform}, appIdentifier ${appIdentifier} and buildProfile ${buildProfile} are expired`
    );

  const latestBuild = nonExpiredBuilds[0] as Build;

  return latestBuild.artifacts.applicationArchiveUrl;
};
