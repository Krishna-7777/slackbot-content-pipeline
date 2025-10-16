const { App } = require('@slack/bolt');
require('dotenv').config()

const app = new App({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  token: process.env.SLACK_BOT_TOKEN,
});

app.command("/process-keywords", require('./commands/processKeywords'))
app.command("/process-uploaded-file", require('./commands/processUploadedFile'));
app.command("/history", require('./commands/history'));

; (async () => {
  // Start the app
  await app.start(process.env.PORT || 3000);

  app.logger.info('Slack Bolt app is running!');
})();