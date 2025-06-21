require('dotenv').config();
const tmi = require('tmi.js');

const client = new tmi.Client({
  identity: {
    username: process.env.BOT_USERNAME,
    password: process.env.OAUTH_TOKEN
  },
  channels: [ process.env.CHANNEL ]
});

client.connect();

client.on('message', (channel, tags, message, self) => {
  if(self) return;

  if(message.toLowerCase() === '!ping') {
    client.say(channel, `@${tags.username} pong !`);
  }
});
