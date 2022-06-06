import { remark } from 'remark';
import SSBRef from 'ssb-ref';
import { getFeedSSBURIRegex, getMessageSSBURIRegex } from 'ssb-uri2';
import gemojiToEmoji from 'remark-gemoji-to-emoji';
import linkifyRegex from 'remark-linkify-regex';
import getUnicodeWordRegex from 'unicode-word-regex';
import { imagesToSsbServeBlobs } from '~/utils';

/**
 * Match URIs *except* SSB URIs and File URIs
 */
const getMiscURIRegex = () =>
  /\b((?=[a-z]+:)(?!(ssb:|file:)))[a-z]+:(\/\/)?[^ )\n]+/g;

const processMarkdown = (rawMarkdown: string) => {
  const linkifySsbSigilFeeds = linkifyRegex(SSBRef.feedIdRegex);
  const linkifySsbSigilMsgs = linkifyRegex(SSBRef.msgIdRegex);
  const linkifySsbUriFeeds = linkifyRegex(getFeedSSBURIRegex());
  const linkifySsbUriMsgs = linkifyRegex(getMessageSSBURIRegex());
  const linkifyMiscUris = linkifyRegex(getMiscURIRegex());
  const linkifyHashtags = linkifyRegex(
    new RegExp('#(' + getUnicodeWordRegex().source + '|\\d|-)+', 'gu')
  );

  const markdown = remark()
    .use(gemojiToEmoji)
    .use(linkifySsbSigilFeeds)
    .use(linkifySsbSigilMsgs)
    .use(linkifySsbUriFeeds)
    .use(linkifySsbUriMsgs)
    .use(linkifyMiscUris)
    .use(linkifyHashtags)
    .use(imagesToSsbServeBlobs)
    .processSync(rawMarkdown);

  return markdown;
};

export default processMarkdown;
