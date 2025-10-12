const {kmeans} = require('ml-kmeans');

function clusterKeywords(embeddings) {
  const n = embeddings.length;
  if (!embeddings || n === 0) return [];

   let k = Math.floor(Math.sqrt(n));
  if (k < 1) k = 1;
  if (k >= n) k = n - 1;

  const vectors = embeddings.map(e => e.vector);
  const keywords = embeddings.map(e => e.keyword);

  // Run K-means
  const km = kmeans(vectors, k);

  // Build cluster groups
  const clusters = [];
  for (let i = 0; i < k; i++) {
    clusters.push({ keywords: [], center: km.centroids[i].centroid });
  }

  km.clusters.forEach((clusterIndex, idx) => {
    clusters[clusterIndex].keywords.push(keywords[idx]);
  });

  return clusters;
}

module.exports = { clusterKeywords };
