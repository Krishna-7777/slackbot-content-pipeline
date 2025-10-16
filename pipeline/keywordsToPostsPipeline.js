const { parseCSV } = require('../utils/parseCSV');
const { cleanKeywords } = require('../utils/cleanKeywords');
const { embedKeywords } = require('../utils/embedKeywords');
const { clusterKeywords } = require('../utils/clusterKeywords');
const { suggestPostIdeas } = require('../utils/suggestPostIdeas');
const { analyzeTopContent } = require('../utils/analyzeTopContent')
const { generatePDFReport } = require('../utils/generatePDFReport');
const { uploadResultsToSlack } = require('../utils/uploadResultsToSlack');

async function processKeywordsPipeline(text, say = async (msg) => console.log(msg), client, channelId) {
  try {

    await say("📥 Starting keyword processing...");

    // Parse keywords
    const parsed = parseCSV(text);
    await say(`✅ Parsed ${parsed.length} raw keywords.`);

    // Clean and normalize
    const cleaned = cleanKeywords(parsed);
    await say(`🧹 Cleaned and deduplicated ${cleaned.length} keywords.`);

    // Generate embeddings
    await say("🧩 Clustering similar keywords...");
    const embeddings = await embedKeywords(cleaned);

    // Cluster keywords by similarity
    const clusters = clusterKeywords(embeddings);
    await say(`✅ Created ${clusters.length} keyword groups.`);


    // Analyze top-ranking content
    await say("🔍 Analyzing top-ranking pages for each cluster...");
    const analysisResults = await analyzeTopContent(clusters);

    // Suggest post ideas
    await say("💡 Suggesting post ideas...");
    const ideas = await suggestPostIdeas(analysisResults);
    for (const [i, idea] of ideas.entries()) {
      await say(`Group ${i + 1}: \n- ${idea.ideas.join('\n- ')}\n \`Keywords: ${idea.keywords.join()}\``);
    }

    // Generate report
    const summary = {
      "Parsed Keywords": parsed.length,
      "Cleaned Keywords": cleaned.length,
      "Groups Created": clusters.length,
      "Ideas Generated": ideas.length,
    };

    await say("📝 Generating PDF report...");
    const pdfPath = await generatePDFReport(summary, clusters, ideas);

    // Upload Pdf File to slack
    await say("📤 Uploading report");
    await uploadResultsToSlack(client, channelId, pdfPath, "Slackbot Content Pipeline Report "+ `(${new Date().toLocaleDateString()})`);

    await say("🚀 Keyword processing pipeline completed successfully!");

  } catch (error) {
    console.error(error);
    await say(`❌ Pipeline Failed\n${error?.message || ""}`);
  }
}

module.exports = processKeywordsPipeline;
