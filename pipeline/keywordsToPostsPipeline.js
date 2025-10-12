const { parseCSV } = require('../utils/parseCSV');
const { cleanKeywords } = require('../utils/cleanKeywords');

async function processKeywordsPipeline(text, say = async (msg) => console.log(msg)) {
  try {

    await say("📥 Starting keyword processing...");

    const parsed = parseCSV(text);
    await say(`✅ Parsed ${parsed.length} raw keywords.`);

    const cleaned = cleanKeywords(parsed);
    await say(`🧹 Cleaned and deduplicated ${cleaned.length} keywords.`);

    await say("🚀 Keywords processing pipeline completed.");

  } catch (error) {
    console.error(error)
    await say(`❌ Pipeline Failed\n${error?.message || ""}`)
  }
}

module.exports = processKeywordsPipeline;
