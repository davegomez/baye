// {
//   FeedId1: {
//     FeedId2: value, // a weight for the edge FeedId1 => FeedId2
//   },
//   FeedId3: {
//     FeedId4: value,
//     FeedId5: value,
//   },
// }
//
// Weighting
// Following: zero or positive
// Blocking: -1
// Not following and not blocking: -2

export async function getSocialGraph(ssb) {
  const relationshipObject = await new Promise((resolve, reject) => {
    ssb.friends.graph((e, graph = {}) => {
      if (e) {
        console.error(`Error while getting social graph data: ${e}`);
        reject(e);
      }

      resolve(graph);
    });
  });

  return relationshipObject;
}

export const weightings = {
  following: 1,
  blocking: -1,
  indiferent: -2,
};
