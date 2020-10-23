/* eslint-disable import/no-dynamic-require, global-require */

const { link } = require('linkfs');
const mock = require('mock-require');
const fs = require('fs');
const tmpDir = require('os').tmpdir();

/* -----------------------------------
 *
 * Gatsby
 *
 * -------------------------------- */

function invokeGatsby(context) {
  const gatsby = require('gatsby/dist/commands/build');

  gatsby({
    directory: __dirname,
  })
    .then(context.succeed)
    .catch(context.fail);
}

/* -----------------------------------
 *
 * Output
 *
 * -------------------------------- */

function rewriteFs() {
  // redirect paths
  const linkedFs = link(fs, [
    [`${__dirname}/.cache`, `${tmpDir}/.cache`],
    [`${__dirname}/public`, `${tmpDir}/public`],
  ]);

  // those are missing in linkfs
  linkedFs.ReadStream = fs.ReadStream;
  linkedFs.WriteStream = fs.WriteStream;

  // replace fs with linkfs globally
  mock('fs', linkedFs);
}

/* -----------------------------------
 *
 * Handler
 *
 * -------------------------------- */

exports.handler = (event, context) => {
  rewriteFs();
  invokeGatsby(context);
};
