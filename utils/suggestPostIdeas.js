const { getAIResponse } = require("./getAIResponse"); // adjust path as needed

// Using AI to generated ideas for each group with scraped data
async function suggestPostIdeas(analysisResults) {
  const allIdeas = [];

  for (const result of analysisResults) {
    const { cluster, topPages } = result;
    const clusterName = cluster[0] || "General Topic";

    const combinedText = topPages
      .map(
        (p) =>
          `Title: ${p.title}\nHeadings: ${(p.headings || []).join(", ")}`
      )
      .join("\n\n");

    const prompt = `
You are a creative content strategist.

Given the top-ranking pages for the topics "${cluster.join(', ')}", generate 3 unique and engaging blog post ideas that:
- Stand out from competitors
- Have SEO potential
- Sound like something a human strategist would propose
- Avoid generic titles like "Top 10 Tips" or "Ultimate Guide"
- Titles should be less than 20 words, concise, readable, and not include explanations.

Top-ranking pages:
${combinedText}

Respond ONLY with 3 numbered post titles.
Do not include any introductions, explanations, or extra sentences.
    `;

    try {
      const response = await getAIResponse(prompt);

      const text =
        response?.choices?.[0]?.message?.content ||
        response?.data?.choices?.[0]?.message?.content ||
        "";

      const ideas = text
        .split(/\n+/)
        .map((line) => line.replace(/^\d+[\.\)]\s*/, "").trim())
        .filter((line) => line);

      allIdeas.push({
        clusterName,
        keywords: cluster,
        ideas,
      });
    } catch (err) {
      console.error(`❌ Error generating ideas for "${clusterName}":`, err);
      allIdeas.push({
        clusterName,
        keywords: cluster,
        ideas: [`(Error generating ideas)`],
      });
    }
  }

  return allIdeas;
}

module.exports = { suggestPostIdeas };
