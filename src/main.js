import * as core from "@actions/core";

main().catch((err) => {
  core.setFailed(err.message);
});

async function main() {}
