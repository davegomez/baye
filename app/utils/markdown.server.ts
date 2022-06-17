import toUrl from 'ssb-serve-blobs/id-to-url'

/**
 * Match URIs *except* SSB URIs and File URIs
 */
const getMiscURIRegex = () =>
  /\b((?=[a-z]+:)(?!(ssb:|file:)))[a-z]+:(\/\/)?[^ )\n]+/g

export const preProcessMarkdown = async (rawMarkdown: string) => {
  const { default: gemojiToEmoji } = await import('remark-gemoji-to-emoji')
  const { default: getUnicodeWordRegex } = await import('unicode-word-regex')
  const { default: linkifyRegex } = await import('remark-linkify-regex')
  const { default: SSBRef } = await import('ssb-ref')
  const { getFeedSSBURIRegex, getMessageSSBURIRegex } = await import('ssb-uri2')
  const { remark } = await import('remark')
  const { visit } = await import('unist-util-visit')

  const linkifySsbSigilFeeds = linkifyRegex(SSBRef.feedIdRegex)
  const linkifySsbSigilMsgs = linkifyRegex(SSBRef.msgIdRegex)
  const linkifySsbUriFeeds = linkifyRegex(getFeedSSBURIRegex())
  const linkifySsbUriMsgs = linkifyRegex(getMessageSSBURIRegex())
  const linkifyMiscUris = linkifyRegex(getMiscURIRegex())
  const linkifyHashtags = linkifyRegex(
    new RegExp(`#(${getUnicodeWordRegex().source}|\\d|-)+`, 'gu'),
  )

  const BLOB_REF = `&${Buffer.alloc(32).toString('base64')}.sha256`

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const imagesToSsbServeBlobs = () => (tree: any) => {
    visit(tree, 'image', image => {
      if (
        image.url &&
        typeof image.url === 'string' &&
        SSBRef.isBlob(image.url.substr(0, BLOB_REF.length))
      ) {
        image.url = toUrl(image.url)
      }

      return image
    })

    return tree
  }

  const markdown = await remark()
    .use(gemojiToEmoji)
    .use(linkifySsbSigilFeeds)
    .use(linkifySsbSigilMsgs)
    .use(linkifySsbUriFeeds)
    .use(linkifySsbUriMsgs)
    .use(linkifyMiscUris)
    .use(linkifyHashtags)
    .use(imagesToSsbServeBlobs)
    .process(rawMarkdown)

  return markdown
}

export const compileMarkdown = async (processedMarkdown: string) => {
  const { bundleMDX } = await import('mdx-bundler')

  try {
    const { code } = await bundleMDX({
      source: processedMarkdown,
    })

    return { code }
  } catch (e: unknown) {
    throw new Error(`Markdown compilation error ${e}`)
  }
}
