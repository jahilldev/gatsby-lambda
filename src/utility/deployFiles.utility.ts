import { S3 } from 'aws-sdk';
import fs from 'fs';
import path from 'path';

/* -----------------------------------
 *
 * Variables
 *
 * -------------------------------- */

const BUCKET = 'BUCKET';

/* -----------------------------------
 *
 * S3
 *
 * -------------------------------- */

const s3 = new S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

/* -----------------------------------
 *
 * Paths
 *
 * -------------------------------- */

async function getFilePaths(value) {
  const directory = await fs.promises.readdir(value, { withFileTypes: true });

  const files = await Promise.all(
    directory.map((file) => {
      const result = path.resolve(value, file.name);

      return file.isDirectory() ? getFilePaths(result) : result;
    })
  );

  return [].concat(...files);
}

/* -----------------------------------
 *
 * Deploy
 *
 * -------------------------------- */

async function deployFiles() {
  const filePaths = await getFilePaths('./public');

  await Promise.all(
    filePaths.map((filePath) =>
      s3
        .putObject({
          Bucket: BUCKET,
          Key: filePath.split('public'),
          Body: fs.readFileSync(filePath),
        })
        .promise()
    )
  );
}

/* -----------------------------------
 *
 * Export
 *
 * -------------------------------- */

export { deployFiles };
