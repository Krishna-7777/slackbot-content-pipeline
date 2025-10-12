async function processUploadedFile({ command, ack, say, logger, client }) {
  await ack({ "response_type": "in_channel" });
  const args = command.text.trim();

  if (!args) {
    await fetchFilesAndSendRespectiveResponse()
    return;
  }

  const fileId = args;
  let  file;
  try {
    file = await client.files.info({ file: fileId })
    file = file.file
  } catch {
    file = null
  } 
    
  if (!file) {
    await say(`File with ID *${fileId}* not found.`);
    await fetchFilesAndSendRespectiveResponse()
    return;
  }

  await say(`Downloading *${file.name}*...`);

  try {
    const res = await fetch(file.url_private, {
      headers: { Authorization: `Bearer ${process.env.SLACK_BOT_TOKEN}` }
    });
    const csvText = await res.text();

    await say(`Successfully downloaded *${file.name}* (${csvText.length} chars).`);

  } catch (err) {
    logger.error(err);
    await say(`Error while fetching file: ${err.message}`);
  }

  async function fetchFilesAndSendRespectiveResponse() {
    let fileList = await client.files.list({
      user: command.user_id,
      count: 5,
      types: "csv"
    });
    fileList = fileList?.files || []
    if (fileList.length === 0) {
      await say("No files found. Please upload a CSV file first.");
      return;
    }

    const list = fileList
      .map(f => {
        const date = new Date(f.timestamp * 1000).toLocaleString('en-IN', {
          day: '2-digit',
          month: 'short',
          hour: '2-digit',
          minute: '2-digit'
        });
        return `• *${f.name}* (ID: \`${f.id}\`, Uploaded: ${date})`;
      })
      .join('\n');

    await say(`Please specify a file ID to process:\n\`/process_uploaded_file <file_id>\`\n\nRecent uploads:\n${list}`);
  }
}

module.exports = processUploadedFile;
