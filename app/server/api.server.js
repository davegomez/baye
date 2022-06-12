import * as profile from '~/server/entities/profile'

export const getProfile = async (ssb, feedId = 'self') => {
  try {
    return profile.getProfile(ssb, feedId === 'self' ? ssb.id : feedId)
  } catch (e) {
    throw new Error(`${e.name} on getProfile: ${e.message}`)
  }
}
