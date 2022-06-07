import * as React from 'react';
import { twMerge } from 'tailwind-merge';

type Props = {
  children: string;
  className?: string;
};

export type Ref = HTMLDivElement;

const Markdown = React.forwardRef<Ref, Props>(
  ({ className, ...props }: Props, ref) => (
    <div
      {...props}
      className={twMerge(
        'prose max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 my-4',
        className
      )}
      ref={ref}
    />
  )
);

Markdown.displayName = 'Markdown';

export default Markdown;
