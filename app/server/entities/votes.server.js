import pull from 'pull-stream'
import { where, votesFor, toPullStream } from 'ssb-db2/operators'

export const getVotes = async (ssb, msgId) => {
  const rawVotes = await new Promise((resolve, reject) => {
    pull(
      ssb.db.query(where(votesFor(msgId)), toPullStream()),
      pull.filter(
        ({
          value: {
            content: { type, vote },
          },
        }) =>
          type === 'vote' &&
          vote &&
          typeof vote.value === 'number' &&
          vote.value >= 0 &&
          vote.link === msgId,
      ),
      pull.collect((err, collectedMessages) => {
        if (err) {
          reject(err)
        } else {
          resolve(collectedMessages)
        }
      }),
    )
  })

  // { @key: 1, @key2: 0, @key3: 1 }
  // only one vote per person!
  const reducedVotes = rawVotes.reduce((acc, vote) => {
    acc[vote.value.author] = vote.value.content.vote.value
    return acc
  }, {})

  // gets *only* the people who voted 1
  // [ @key, @key, @key ]
  const voters = Object.entries(reducedVotes)
    .filter(([, value]) => value === 1)
    .map(([key]) => key)

  return voters
}
