import {remark} from 'remark'
import {visit} from 'unist-util-visit'
import gemojiToEmoji from 'remark-gemoji-to-emoji'
import linkifyRegex from 'remark-linkify-regex'
import getUnicodeWordRegex from 'unicode-word-regex'
import SSBRef from 'ssb-ref'
import {getFeedSSBURIRegex, getMessageSSBURIRegex} from 'ssb-uri2'
import toUrl from 'ssb-serve-blobs/id-to-url'

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

/**
 * Match URIs *except* SSB URIs and File URIs
 */
const getMiscURIRegex = () =>
  /\b((?=[a-z]+:)(?!(ssb:|file:)))[a-z]+:(\/\/)?[^ )\n]+/g

export const preProcessMarkdown = async (rawMarkdown: string) => {
  const linkifySsbSigilFeeds = linkifyRegex(SSBRef.feedIdRegex)
  const linkifySsbSigilMsgs = linkifyRegex(SSBRef.msgIdRegex)
  const linkifySsbUriFeeds = linkifyRegex(getFeedSSBURIRegex())
  const linkifySsbUriMsgs = linkifyRegex(getMessageSSBURIRegex())
  const linkifyMiscUris = linkifyRegex(getMiscURIRegex())
  const linkifyHashtags = linkifyRegex(
    new RegExp(`#(${getUnicodeWordRegex().source}|\\d|-)+`, 'gu'),
  )

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
