import meow from "meow";

import { convertTarToZip } from "./convertTarToZip";
import { downloadFile } from "./downloadFile";
import { getEASAppArchiveUrl } from "./getEASAppArchiveUrl";
import { sendToMaestroCloud } from "./sendToMaestroCloud";

const cli = meow(
  `
  Usage
    $ yarn sucrase-node ./maestro/scripts/downloadAndSendToMaestro.ts

  Options
    --platform                Your app platform: 
                                > ios || android
    --appIdentifier           Your appId as defined in app.config.ts or app.json.
                              You will find it in the "ios.bundleIdentifier" or "android.package" field.
                                > Example: com.mathieuf.maestroexpo
    --buildProfile            Your desired build profile as defined in eas.json.
                              You will find it in the "builds" field. Warning: pick a build profile that targets
                              simulator on iOS (builds.[buildProfile].ios.simulator === true) -> necessary for Maestro
                                > Example: development-simulator
    --maestroTestsDirectory   The directory where your maestro tests are located.
                              Defaults to './maestro/'.
                                > Example: ./maestro/
    --iosUpdateId             The update ID of the iOS update to test.
                              Required if platform is 'ios'.
                                > Example: 1234
    --androidUpdateId         The update ID of the Android update to test.
                              Required if platform is 'android'.
                                > Example: 1234
    --apiKey                  Your Maestro Cloud API key.
                                > Example: 1234
    --async                   Whether to run the Maestro Cloud command asynchronously.
                              Defaults to true.
                                > Example: false
    --tags                    A comma-separated list of maestro tags. This will run all flows containing the provided tags;
                              it doesn't matter if those Flows also have other tags.
                                > Example: tag1,tag2

  Examples
    $ yarn sucrase-node scripts/downloadAndSendToMaestro.ts --platform ios --appIdentifier com.mathieuf.maestroexpo --buildProfile development-simulator
`,
  {
    flags: {
      platform: {
        type: "string",
        isRequired: true,
      },
      appIdentifier: {
        type: "string",
        isRequired: true,
      },
      buildProfile: {
        type: "string",
        isRequired: true,
      },
      maestroTestsDirectory: {
        type: "string",
        isRequired: false,
        default: ".maestro",
      },
      iosUpdateId: {
        type: "string",
        isRequired: (flags) => (flags.platform as string) === "ios",
      },
      androidUpdateId: {
        type: "string",
        isRequired: (flags) => (flags.platform as string) === "android",
      },
      apiKey: {
        type: "string",
        isRequired: false,
      },
      async: {
        type: "boolean",
        isRequired: false,
        default: true,
      },
      tags: {
        type: "string",
        isRequired: false,
      }
    },
  }
);

const {
  platform,
  appIdentifier,
  buildProfile,
  maestroTestsDirectory,
  iosUpdateId,
  androidUpdateId,
  apiKey,
  async,
  tags,
} = cli.flags;

if (platform !== "ios" && platform !== "android")
  throw new Error("Invalid platform. Must be 'ios' or 'android'");

const downloadAndSendToMaestro = async () => {
  const url = await getEASAppArchiveUrl({
    platform,
    appIdentifier,
    buildProfile,
  });

  let tmpPath = await downloadFile(url);

  if (platform === "ios") {
    tmpPath = await convertTarToZip(tmpPath);
  }

  void sendToMaestroCloud({
    appPath: tmpPath,
    maestroTestsDirectory: maestroTestsDirectory,
    apiKey,
    iosUpdateId,
    androidUpdateId,
    async,
    tags,
  });
};

void downloadAndSendToMaestro();
