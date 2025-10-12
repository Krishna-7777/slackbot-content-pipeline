const { pipeline } = require('@huggingface/transformers');

let embedder;
async function initEmbedder() {
  if (!embedder) {
    console.log("🧠 Loading local embedding model (MiniLM)...");
    embedder = await pipeline('feature-extraction', 'sentence-transformers/all-MiniLM-L6-v2');
  }
  return embedder;
}

async function embedKeywords(keywords) {
  const embedder = await initEmbedder();

  // Generate vector embeddings for each keyword
  const vectors = await embedder(keywords, { pooling: 'mean', normalize: true });

  const embeddings = keywords.map((k, i) => ({
    keyword: k,
    vector: Array.from(vectors[i]),
  }));

  return embeddings;
}

module.exports = { embedKeywords };
