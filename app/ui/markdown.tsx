import * as React from 'react'
import * as mdxBundler from 'mdx-bundler/client'
import { twMerge } from 'tailwind-merge'

type Props = {
  content: string
  className?: string
}

export type Ref = HTMLDivElement

const Markdown = React.forwardRef<Ref, Props>(
  ({ className, content, ...props }: Props, ref) => {
    const Content = mdxBundler.getMDXComponent(content)
    return (
      <div
        {...props}
        className={twMerge(
          'prose max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 my-4',
          className,
        )}
        ref={ref}
      >
        <Content />
      </div>
    )
  },
)

Markdown.displayName = 'Markdown'

export default Markdown
