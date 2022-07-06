import { getBlob } from '~/server/entities/blob.server'
import * as socialGraph from '~/server/entities/utils/social-graph.server'

const getSSBProfile = async (ssb, feedId) =>
  new Promise((resolve, reject) => {
    ssb.db.onDrain('aboutSelf', () => {
      try {
        const profile = ssb.db.getIndex('aboutSelf').getProfile(feedId)
        resolve(profile)
      } catch (err) {
        console.error(`${err.name} while getting profile data: ${err.message}`)
        reject(err)
      }
    })
  })

export const getProfile = async (ssb, feedId) =>
  new Promise(async (resolve, reject) => {
    try {
      const {
        name,
        description = '',
        image = '',
      } = await getSSBProfile(ssb, feedId)
      let imageBlob = ''

      try {
        if (image) {
          imageBlob = await getBlob(ssb, image)
        }
      } catch (err) {
        throw new Error(`${err.name} while getting image: ${err.message}`)
      }

      const profile = {
        description,
        feedId,
        image,
        imageBlob,
        isSelf: ssb.id === feedId,
        name: name || feedId.slice(1, 1 + 8),
      }

      if (feedId !== ssb.id) {
        const graph = await socialGraph.getSocialGraph(ssb)

        profile.following =
          graph[ssb.id][feedId] === socialGraph.weightings.following
      }

      resolve(profile)
    } catch (err) {
      reject(err)
    }
  })
