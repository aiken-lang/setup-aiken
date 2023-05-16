import * as core from "@actions/core";
import * as tc from "@actions/tool-cache";

main().catch((err) => {
  core.setFailed(err.message);
});

const baseDownloadUrl = "https://github.com/aiken-lang/aiken/releases/download";

async function main() {
  let version = core.getInput("version", {
    required: true,
    trimWhitespace: true,
  });

  core.startGroup(`Installing Aiken ${version}`);

  try {
    let cachedPath = tc.find("aiken", version);

    if (!cachedPath) {
      const tarPath = await tc.downloadTool(
        `${baseDownloadUrl}/${version}/aiken_${version}_${process.platform}_${platform.arch}.tar.gz`,
      );

      const extractPath = await tc.extractTar(tarPath, undefined, ["xzC"]);

      cachedPath = await tc.cacheDir(extractPath, "aiken", fullVersion);
    }

    core.addPath(cachedPath);

    core.exportVariable("INSTALL_DIR_FOR_AIKEN", cachedPath);
  } catch (err) {
    core.error(
      `Aiken install failed for platform '${process.platform}' on arch '${platform.arch}'`,
    );

    core.error(`${err}\n${err.stack}`);

    throw new Error(`Could not install Aiken ${version}`);
  }

  core.info(`Installed Aiken ${version}`);

  core.setOutput("version", version);

  core.endGroup();
}
