import pull from 'pull-stream'
import { processMessage } from '~/server/entities/utils/message.server'

const collector = (ssb, resolve, reject) => async (err, collectedThreads) => {
  if (err) {
    console.error(`${err.name} while getting latests posts: ${err.message}`)
    reject(err)
  } else {
    resolve(
      await Promise.all(
        collectedThreads.map(async thread => {
          const root = await processMessage(ssb, thread.root)

          return {
            messages: [root],
            replyCount: thread.replyCount,
          }
        }),
      ),
    )
  }
}

export const getProfileFeed = (ssb, feedId) =>
  new Promise(async (resolve, reject) => {
    try {
      const MAX_MESSAGES = 20

      pull(
        ssb.threads.profileSummary({
          id: feedId,
          allowlist: ['post', 'blog'],
        }),
        pull.take(MAX_MESSAGES),
        pull.collect(collector(ssb, resolve, reject)),
      )
    } catch (err) {
      reject(err)
    }
  })
