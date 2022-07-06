import { getBlob } from '~/server/entities/blob.server'
import { getVotes } from '~/server/entities/votes.server'

export const processMessage = async (
  ssb,
  { key, value: { author, content, timestamp } },
) => {
  let text = content.text

  if (content.type === 'blog') {
    const blog = await getBlob(ssb, content.blog)
    text = `# ${content.title}\n\n> ${content.summary}\n\n---\n${Buffer.from(
      blog || '',
      'base64',
    ).toString('utf-8')})`
  }

  const voters = await getVotes(ssb, key)

  return {
    messageId: key,
    author,
    timestamp,
    text,
    recipients: content.recps,
    voters,
  }
}
