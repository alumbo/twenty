// @ts-check
/** @type {import('@yarnpkg/types')} */

// `@yarnpkg/types` is a devDependency. Production pruning (e.g. Scalingo's
// `yarn heroku prune`) removes it, but yarn's post-install validation still
// loads this file. Guard the require so a no-op export keeps validation green.
let defineConfig;
try {
  ({ defineConfig } = require('@yarnpkg/types'));
} catch (e) {
  module.exports = {};
  return;
}

const semver = require('semver');

const MONOREPO_ROOT_WORKSPACE = 'twenty';

module.exports = defineConfig({
  async constraints({ Yarn }) {
    const rootWorkspace = Yarn.workspace({ ident: MONOREPO_ROOT_WORKSPACE });
    if (!rootWorkspace) {
      throw new Error(
        `Should never occur, ${MONOREPO_ROOT_WORKSPACE} workspace not found`,
      );
    }

    const requiredNodeVersion = rootWorkspace.manifest.engines?.node;
    if (!requiredNodeVersion) {
      throw new Error(
        `Should never occur, ${requiredNodeVersion} could not find node range in engines manifest`,
      );
    }

    const currentNodeVersion = process.version;
    if (!semver.satisfies(currentNodeVersion, requiredNodeVersion)) {
      throw new Error(
        `Node version ${currentNodeVersion} doesn't match the required version, please use ${requiredNodeVersion}`,
      );
    }
  },
});
