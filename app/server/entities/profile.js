import { getBlob } from '~/server/entities/blob';
import * as socialGraph from '~/server/entities/utils/social-graph';

async function getSSBProfile(ssb, feedId) {
  return new Promise((resolve, reject) => {
    ssb.db.onDrain('aboutSelf', () => {
      try {
        const profile = ssb.db.getIndex('aboutSelf').getProfile(feedId);
        resolve(profile);
      } catch (e) {
        console.error(`${e.name} while getting profile data: ${e.message}`);
        reject(e);
      }
    });
  });
}

export async function getProfile(ssb, feedId) {
  return new Promise(async (resolve, reject) => {
    try {
      const {
        name,
        description = '',
        image = '',
      } = await getSSBProfile(ssb, feedId);
      let imageBlob = '';

      try {
        if (image) {
          imageBlob = await getBlob(ssb, image);
        }
      } catch ({ message, name }) {
        throw new Error(`${name} while getting image: ${message}`);
      }

      const profile = {
        description,
        feedId,
        image: image,
        imageBlob,
        isSelf: ssb.id === feedId,
        name: name || feedId.slice(1, 1 + 8),
      };

      if (feedId !== ssb.id) {
        const graph = await socialGraph.getSocialGraph(ssb);

        profile.following =
          graph[ssb.id][feedId] === socialGraph.weightings.following;
      }

      resolve(profile);
    } catch (err) {
      reject(err);
    }
  });
}
