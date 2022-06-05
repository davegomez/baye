import * as React from 'react';
import { remark } from 'remark';
import SSBRef from 'ssb-ref';
import { getFeedSSBURIRegex, getMessageSSBURIRegex } from 'ssb-uri2';
import gemojiToEmoji from 'remark-gemoji-to-emoji';
import linkifyRegex from 'remark-linkify-regex';
import getUnicodeWordRegex from 'unicode-word-regex';
import { twMerge } from 'tailwind-merge';

type Props = {
  children: string;
  className?: string;
};

export type Ref = HTMLDivElement;

/**
 * Match URIs *except* SSB URIs and File URIs
 */
function getMiscURIRegex() {
  return /\b((?=[a-z]+:)(?!(ssb:|file:)))[a-z]+:(\/\/)?[^ )\n]+/g;
}

const Button = React.forwardRef<Ref, Props>(
  ({ children, className }: Props, ref) => {
    const linkifySsbSigilFeeds = linkifyRegex(SSBRef.feedIdRegex);
    const linkifySsbSigilMsgs = linkifyRegex(SSBRef.msgIdRegex);
    const linkifySsbUriFeeds = linkifyRegex(getFeedSSBURIRegex());
    const linkifySsbUriMsgs = linkifyRegex(getMessageSSBURIRegex());
    const linkifyMiscUris = linkifyRegex(getMiscURIRegex());
    const linkifyHashtags = linkifyRegex(
      new RegExp('#(' + getUnicodeWordRegex().source + '|\\d|-)+', 'gu')
    );

    const content = remark()
      .use(gemojiToEmoji)
      .use(linkifySsbSigilFeeds)
      .use(linkifySsbSigilMsgs)
      .use(linkifySsbUriFeeds)
      .use(linkifySsbUriMsgs)
      .use(linkifyMiscUris)
      .use(linkifyHashtags)
      .processSync(children);

    return (
      <div
        className={twMerge(
          'prose max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 my-4',
          className
        )}
        ref={ref}
      >
        {String(content)}
      </div>
    );
  }
);

Button.displayName = 'Button';

export default Button;
