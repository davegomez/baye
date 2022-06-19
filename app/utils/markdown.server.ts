import { bundleMDX } from 'mdx-bundler'
import { getFeedSSBURIRegex, getMessageSSBURIRegex } from 'ssb-uri2'
import { remark } from 'remark'
import { visit } from 'unist-util-visit'
import gemojiToEmoji from 'remark-gemoji-to-emoji'
import getUnicodeWordRegex from 'unicode-word-regex'
import linkifyRegex from 'remark-linkify-regex'
import path from 'path'
import SSBRef from 'ssb-ref'
import toUrl from 'ssb-serve-blobs/id-to-url'

/**
 * esbuild relies on __dirname to work out where is executable is and needs to
 * be told manually where to look.
 * Adding the following code before your bundleMDX will point esbuild directly
 * at the correct executable for your platform.
 * https://github.com/kentcdodds/mdx-bundler/blob/main/README.md#nextjs-esbuild-enoent
 */
if (process.platform === 'win32') {
  process.env.ESBUILD_BINARY_PATH = path.join(
    process.cwd(),
    'node_modules',
    'esbuild',
    'esbuild.exe',
  )
} else {
  process.env.ESBUILD_BINARY_PATH = path.join(
    process.cwd(),
    'node_modules',
    'esbuild',
    'bin',
    'esbuild',
  )
}

const BLOB_REF = `&${Buffer.alloc(32).toString('base64')}.sha256`

/**
 * Match URIs *except* SSB URIs and File URIs
 */
const getMiscURIRegex = () =>
  /\b((?=[a-z]+:)(?!(ssb:|file:)))[a-z]+:(\/\/)?[^ )\n]+/g

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

export const compileMarkdown = async (processedMarkdown: string) => {
  try {
    const { code } = await bundleMDX({
      source: processedMarkdown,
    })

    return { code }
  } catch (e: unknown) {
    throw new Error(`Markdown compilation error ${e}`)
  }
}
