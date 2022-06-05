import pull from 'pull-stream';

export async function getBlob(ssb, blobId) {
  const bufferSource = ssb.blobs.get(blobId);

  return new Promise((resolve) => {
    pull(
      bufferSource,
      pull.collect(async (e, bufferArray) => {
        if (e) {
          await ssb.blobs.want(blobId, (e, done) => {
            if (e) {
              console.error(`Error while getting blob data: ${e}`);
            }
          });

          resolve(Buffer.alloc(0));
        } else {
          const buffer = Buffer.concat(bufferArray);

          resolve(buffer.toString('base64'));
        }
      })
    );
  });
}
