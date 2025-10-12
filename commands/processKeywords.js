async function processKeywords({ command, ack, say, logger }) {
  await ack({"response_type": "in_channel"});

  const input = command.text?.trim();
  if (!input) {
    await say("Please provide a comma-separated list of keywords. Example:\n`/process_keywords keyword1, keyword2, keyword3`");
    return;
  }

  logger.info(`Processing keywords`);
  await say(`Received Keyword (${input.length} chars)`);
}

module.exports = processKeywords;
