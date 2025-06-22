require('dotenv').config();
const tmi = require('tmi.js');
const express = require('express');
const cors = require('cors');

const client = new tmi.Client({
  identity: {
    username: process.env.BOT_USERNAME,
    password: process.env.OAUTH_TOKEN
  },
  channels: [ process.env.CHANNEL ]
});

client.connect();

// Partie API Express
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: '*' // tu peux restreindre à ton site plus tard !
}));
app.use(express.json());

app.post('/command', async (req, res) => {
  const { cmd, question, prediction } = req.body;
  const channel = `#${process.env.CHANNEL}`;
  try {
    if (cmd === 'clear_chat') {
      await client.say(channel, "/clear");
    }
    else if (cmd === 'shoutout') {
      await client.say(channel, "/shoutout"); // À remplacer par la commande shoutout si besoin
    }
    else if (cmd === 'poll' && question) {
      await client.say(channel, `!poll ${question}`);
    }
    else if (cmd === 'prediction' && prediction) {
      await client.say(channel, `!prediction ${prediction}`);
    }
    else {
      return res.status(400).json({ ok: false, error: "Commande inconnue ou params manquants" });
    }
    return res.json({ ok: true });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
});

app.get('/', (req, res) => {
  res.send('Crocro_bot API OK');
});

app.listen(PORT, () => {
  console.log(`API crocro_bot en écoute sur le port ${PORT}`);
});

// Partie écoute tchat inchangée
client.on('message', (channel, tags, message, self) => {
  if(self) return;
  if(message.toLowerCase() === '!ping') {
    client.say(channel, `@${tags.username} pong !`);
  }
});
