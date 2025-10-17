const { getHistoryById } = require("../db/historyLogger.js");
const processKeywordsPipeline = require("../pipeline/keywordsToPostsPipeline.js");

async function regenerateCommand({ ack, say, command, client }) {
    await ack({ "response_type": "in_channel" });

    const id = parseInt(command.text?.trim());
    if (!id) {
        await say("⚠️ Please provide a valid history ID. Example: `/regenerate 12`");
        return;
    }

    const prev = getHistoryById(id);
    if (!prev) {
        await say(`❌ No record found for ID ${id}.`);
        return;
    }

    await say(`🔁 Re-running pipeline for previous entry #${id}...`);

    // Run pipeline again using stored raw keywords
    await processKeywordsPipeline(prev.keywords_raw, say, client, command.channel_id, command.command);

}

module.exports = regenerateCommand;
