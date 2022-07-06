import * as profile from '~/server/entities/profile.server'
import * as feed from '~/server/entities/feed.server'

export const getProfile = async (ssb, feedId = 'self') => {
  try {
    return profile.getProfile(ssb, feedId === 'self' ? ssb.id : feedId)
  } catch (err) {
    throw new Error(`${err.name} on getProfile: ${err.message}`)
  }
}

export const getProfileThreads = async (ssb, feedId) => {
  try {
    return feed.getProfileFeed(ssb, feedId === 'self' ? ssb.id : feedId)
  } catch (err) {
    throw new Error(`${err.name} on getProfileThreads: ${err.message}`)
  }
}
