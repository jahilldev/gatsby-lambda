import { S3Event, Context } from 'aws-lambda';
import { link } from 'linkfs';
import mock from 'mock-require';
import fs from 'fs';
import { tmpdir } from 'os';

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
