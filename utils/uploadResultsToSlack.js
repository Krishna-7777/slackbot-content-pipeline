import fs from "fs";

// Uploads file in Slack 
export async function uploadResultsToSlack(client, channelId, filePath, title = "Slackbot Content Pipeline Report") {
  try {
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }
    const fileStream = fs.createReadStream(filePath);

    const result = await client.files.uploadV2({
      channel_id: channelId,
      initial_comment: "📊 Here's your content pipeline report!",
      title,
      file: fileStream,
      filename: title + ".pdf"
    });

    if (result.ok) {
      fs.unlinkSync(filePath);
    }
    return result;
  } catch (err) {
    console.error("⚠️ Error uploading report:", err);
    return { ok: false, error: err.message };
  }
}
