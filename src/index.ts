import express from 'express';
import { InteractionType, verifyKeyMiddleware } from 'discord-interactions';
import 'dotenv/config';

import { Message } from 'types.js';
import commands from './commands/index.js';

const app = express();
const port = process.env.PORT || 3000;
const PUBLIC_KEY = process.env.PUBLIC_KEY;

if (!PUBLIC_KEY) {
  console.error('missing application public key')
  process.exit(1);
}

app.post('/', verifyKeyMiddleware(PUBLIC_KEY), async (req, res) => {
  const message = req.body as Message;

  if (message.type === InteractionType.APPLICATION_COMMAND) {
    console.log(`[server] running ${message.data.name} command`);
    commands[message.data.name]?.(res, message, req);
  }
});

app.listen(port, () => {
  if (process.env.ENV !== 'dev') {
    console.log(`[server]: Server is running at port ${port}`);
  } else {
    console.log(`[server]: Server is running at http://localhost:port ${port}`);
  }
});
