const keywordsToPostsPipeline = require('../pipeline/keywordsToPostsPipeline');

async function processKeywords({ command, ack, say, logger }) {
  await ack({ "response_type": "in_channel" });

  const input = command.text?.trim();
  if (!input) {
    await say("Please provide a comma-separated list of keywords. Example:\n`/process_keywords keyword1, keyword2, keyword3`");
    return;
  }

  logger.info(`Processing keywords`);
  await keywordsToPostsPipeline(input, say);
}

module.exports = processKeywords;
