import { getBlob } from "~/server/entities/blob";
import { socialGraph } from "~/server/entities/utils/social-graph";

async function getSSBProfile(ssb, feedId) {
  return new Promise((resolve, reject) => {
    ssb.db.onDrain("aboutSelf", () => {
      try {
        const profile = ssb.db.getIndex("aboutSelf").getProfile(feedId);
        resolve(profile);
      } catch (err) {
        console.error(err);
        reject(err);
      }
    });
  });
}

export async function getProfile(ssb, feedId) {
  return new Promise(async (resolve, reject) => {
    try {
      let { name, description, image } = await getSSBProfile(ssb, feedId);
      let imageBlob = "";

      try {
        if (image) {
          imageBlob = await getBlob(ssb, image);
        }
      } catch (e) {
        console.error("Error getting image", e);
      }

      const profile = {
        id: feedId,
        name: name || feedId.slice(1, 1 + 8),
        description: description || "",
        image: image || "",
        imageBlob,
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
