import * as core from "@actions/core";
import * as tc from "@actions/tool-cache";

main().catch((err) => {
  core.setFailed(err.message);
});

async function main() {
  let version = core.getInput("version", {
    required: true,
    trimWhitespace: true,
  });

  const useCargoDist = version >= "v1.0.28";

  if (useCargoDist) {
    core.info("Detected recent Aiken version using cargo-dist...");
  }

  core.startGroup(`Installing Aiken ${version}`);

  let arch;
  if (useCargoDist) {
    arch = process.arch === "x64" ? "x86_64" : "aarch64";
  } else {
    arch = process.arch === "x64" ? "amd64" : process.arch;
  }
  core.info(`Assuming arch: ${arch}`);

  const platform = useCargoDist
    ? { "linux": "unknown-linux-gnu"
      , "darwin": "apple-darwin"
      , "windows": "pc-windows-msvc"
      }[process.platform]
    : process.platform;
  core.info(`Assuming platform: ${platform}`);

  try {
    let cachedPath = tc.find("aiken", version);

    if (!cachedPath) {
      const baseDownloadUrl =
        "https://github.com/aiken-lang/aiken/releases/download";

      const downloadUrl = useCargoDist
	? `${baseDownloadUrl}/${version}/aiken-${arch}-${version}-${platform}.tar.gz`
        : `${baseDownloadUrl}/${version}/aiken_${version}_${platform}_${arch}.tar.gz`;

      core.info(`Fetching ${downloadUrl}`);

      const tarPath = await tc.downloadTool(downloadUrl);

      const extractPath = await tc.extractTar(tarPath, undefined, ["xzC"]);

      cachedPath = await tc.cacheDir(extractPath, "aiken", version);
    }

    core.addPath(cachedPath);

    core.exportVariable("INSTALL_DIR_FOR_AIKEN", cachedPath);
  } catch (err) {

    core.error(
      `Aiken==${version} install failed for platform '${platform}' on arch '${arch}'`,
    );

    core.error(`${err}\n${err.stack}`);

    throw new Error(`Could not install Aiken ${version}`);
  }

  core.info(`Installed Aiken ${version}`);

  core.setOutput("version", version);

  core.endGroup();
}
