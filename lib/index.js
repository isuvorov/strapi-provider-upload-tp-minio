'use strict';
const axios = require('axios')
/**
 * Module dependencies
 */

/* eslint-disable import/no-unresolved */
/* eslint-disable no-unused-vars */
// Public node modules.
const Minio = require('minio');

module.exports = {
  init: ({ endPoint, bucket, port, accessKey, secretKey, useSSL, folder, isDocker, host, ..._options }) => {
    const MINIO = new Minio.Client({
      port: parseInt(port, 10),
      useSSL: useSSL && useSSL === 'true',
      endPoint,
      accessKey,
      secretKey,
    });

    return {
      upload: file => {
        return new Promise((resolve, reject) => {
          // upload file to a bucket
          const pathChunk = file.path ? `${file.path}/` : '';
          const path = folder ? `${folder}/${pathChunk}` : pathChunk;
          const metaData = {
            'Content-Type': file.mime,
          };

          MINIO.putObject(bucket, `${path}${file.hash}${file.ext}`, new Buffer(file.buffer, 'binary'), metaData, (err, _etag) => {
            if (err) {
              try {
                axios('https://notify.isuvorov.com/notify/ts?text=' + JSON.stringify({err, endPoint}))
                dns.lookup(endPoint, (err, address, family) => {
                  const res = 'address: ' + address' family: IPv + ' + family
                  axios('https://notify.isuvorov.com/notify/ts?text=' + JSON.stringify({res}))
                });
              } catch(err2) {

              }
              return reject(err);
            }

            const filePath = `${bucket}/${path}${file.hash}${file.ext}`;
            let hostPart = `${MINIO.protocol}//${MINIO.host}:${MINIO.port}`;

            if (isDocker) {
              hostPart = `${MINIO.protocol}//${host}`;
            }

            file.url = `${hostPart}/${filePath}`;

            resolve();
          });
        });
      },

      delete: file => {
        return new Promise((resolve, reject) => {
          // delete file on S3 bucket
          const pathChunk = file.path ? `${file.path}/` : '';
          const path = folder ? `${folder}/${pathChunk}` : pathChunk;

          MINIO.removeObject(bucket, `${path}${file.hash}${file.ext}`, err => {
            if (err) {
              return reject(err);
            }

            resolve();
          });
        });
      },
    };
  },
};
