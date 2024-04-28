import execa from "execa";

export const convertTarToZip = async (tarPath: string) => {
  console.log("Converting tar to zip");
  const zipPath = tarPath.replace(".tar.gz", ".zip");

  await execa("tar", ["xzf", tarPath]);
  const { stdout } = await execa("tar", ["tf", tarPath]);
  await execa("zip", [zipPath, ...stdout.split("\n")]);

  return zipPath;
};
