import * as React from 'react';
import { twMerge } from 'tailwind-merge';
import { processMarkdown } from '~/utils';

type Props = {
  children: string;
  className?: string;
};

export type Ref = HTMLDivElement;

const Markdown = React.forwardRef<Ref, Props>(
  ({ children, className }: Props, ref) => {
    const markdown = processMarkdown(children);

    return (
      <div
        className={twMerge(
          'prose max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 my-4',
          className
        )}
        ref={ref}
      >
        {String(markdown)}
      </div>
    );
  }
);

Markdown.displayName = 'Markdown';

export default Markdown;
