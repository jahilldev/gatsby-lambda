import { Context } from 'aws-lambda';
import { link } from 'linkfs';
import mock from 'mock-require';
import fs from 'fs';
import { tmpdir } from 'os';
import { runtimeRequire } from '@/utility/runtimeRequire.utility';
import { deployFiles } from '@/utility/deployFiles.utility';

/* -----------------------------------
 *
 * Variables
 *
 * -------------------------------- */

const tmpDir = tmpdir();

/* -----------------------------------
 *
 * Gatsby
 *
 * -------------------------------- */

function invokeGatsby(context: Context) {
  const gatsby = runtimeRequire('gatsby/dist/commands/build');

  gatsby({
    directory: __dirname,
    verbose: false,
    browserslist: ['>0.25%', 'not dead'],
    sitePackageJson: runtimeRequire('./package.json'),
  })
    .then(deployFiles)
    .then(context.succeed)
    .catch(context.fail);
}

/* -----------------------------------
 *
 * Output
 *
 * -------------------------------- */

function rewriteFs() {
  const linkedFs = link(fs, [
    [`${__dirname}/.cache`, `${tmpDir}/.cache`],
    [`${__dirname}/public`, `${tmpDir}/public`],
  ]);

  linkedFs.ReadStream = fs.ReadStream;
  linkedFs.WriteStream = fs.WriteStream;

  mock('fs', linkedFs);
}

/* -----------------------------------
 *
 * Handler
 *
 * -------------------------------- */

exports.handler = (event: any, context: Context) => {
  rewriteFs();
  invokeGatsby(context);
};
