import pull from 'pull-stream'

export const getBlob = async (ssb, blobId) => {
  const bufferSource = ssb.blobs.get(blobId)

  return new Promise(resolve => {
    pull(
      bufferSource,
      pull.collect(async (err, bufferArray) => {
        if (err) {
          await ssb.blobs.want(blobId, (error, _) => {
            if (error) {
              console.error(`Error while getting blob data: ${error}`)
            }
          })

          resolve(Buffer.alloc(0))
        } else {
          const buffer = Buffer.concat(bufferArray)

          resolve(buffer.toString('base64'))
        }
      }),
    )
  })
}
