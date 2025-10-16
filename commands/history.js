const { getHistory } = require("../db/historyLogger.js");

async function historyCommand({ ack, say, command }) {
    try {
        await ack({ "response_type": "in_channel" });

        const page = +command.text || 1;
        const logs = getHistory(page);

        if (!logs.length) {
            await say("📄 No pipeline history found.");
            return;
        }

        // Build a single template string for all logs
        const logMessage = logs
            .map((log) => {
                const statusEmoji =
                    log.status === "completed"
                        ? "✅"
                        : log.status === "failed"
                            ? "❌"
                            : "⏳";

                return `#${log.id} \n${statusEmoji} *${log.command}* \nStatus: ${log.status}${log.error_reason ? `\nError: ${log.error_reason}` : ""} \nKeywords: ${log.keywords_count} \nRaw: ${log.keywords_raw} \nTime: ${log.created_on}`;
            })
            .join("\n\n");

        await say(`📜 *Pipeline History (Page: ${page})* \n\n${logMessage}`);
    } catch (err) {
        console.error("⚠️ Error in /history command:", err);
        await say("⚠️ Something went wrong fetching the pipeline history.");
    }
}

module.exports = historyCommand;
