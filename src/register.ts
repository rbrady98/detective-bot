import { EVIDENCE_COMMAND } from './commands.js';

// build the correct url
const URL =
  process.env.ENV === 'dev'
    ? `https://discord.com/api/v10/applications/${process.env.APPLICATION_ID}/guilds/${process.env.GUILD_ID}/commands`
    : `https://discord.com/api/v10/applications/${process.env.APPLICATION_ID}/commands`;

const res = await fetch(URL, {
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bot ${process.env.TOKEN}`,
  },
  method: 'PUT',
  body: JSON.stringify([EVIDENCE_COMMAND]),
});

if (res.ok) {
  console.log('Registered all commands with', process.env.ENV === 'dev' ? 'guild': 'application');
} else {
  console.error('Error registering commands');
  const body = await res.json();
  console.error(body);
}
