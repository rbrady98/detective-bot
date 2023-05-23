import {
  InteractionResponseFlags,
  InteractionResponseType,
} from 'discord-interactions';
import { CommandFn } from 'types.js';

const quote: CommandFn = async (res, message) => {
  console.log('inside the quote handler');
  if (!message) return;

  res.status(200).send({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content: 'A detective is on the case...',
      flags: InteractionResponseFlags.EPHEMERAL,
    },
  });

  const { guild_id } = message;

  // Get list of channels
  const channels = await getGuildChannels(guild_id);

  // Check if evidence channel exists
  let channelID = undefined;
  for (const channel of channels) {
    if (channel.name.toLowerCase() === 'evidence') {
      channelID = channel.id;
      break;
    }
  }

  // no channelID means that the channel doesnt exist
  if (!channelID) {
    channelID = await createEvidenceChannel(guild_id);
    console.log('Evidence channel created');
  }

  // Get options from subcommand options array
  const { options } = message.data.options[0];
  const quote: string = options[0].value;
  const author: string = options[1].value;

  createEvidenceQuote(channelID, quote, author);
};

export const getGuildChannels = async (guild_id: string): Promise<Array<any>> => {
  let json: any;

  try {
    const response = await fetch(
      `https://discord.com/api/v10/guilds/${guild_id}/channels`,
      {
        headers: {
          Authorization: `Bot ${process.env.TOKEN}`,
        },
        method: 'GET',
      }
    );
    json = await response.json();
  } catch (error) {
    console.log('There was an error', error);
  }

  return json as Array<any>;
};

const createEvidenceChannel = async (guild_id: string): Promise<string> => {
  let json: { id: string } = { id: '' };

  try {
    const response = await fetch(
      `https://discord.com/api/v10/guilds/${guild_id}/channels`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bot ${process.env.TOKEN}`,
        },
        method: 'POST',
        body: JSON.stringify({
          name: 'evidence',
          type: 0,
          topic: 'The evidence locker',
        }),
      }
    );

    if (!response?.ok) {
      console.log('There has been an error, code:', response?.status);
      return json.id;
    }

    json = await response.json();
  } catch (error) {
    console.log('There has been an error', error);
  }

  return json.id;
};

const createEvidenceQuote = async (
  channelID: string,
  quote: string,
  author: string
) => {
  await fetch(`https://discord.com/api/v10/channels/${channelID}/messages`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bot ${process.env.TOKEN}`,
    },
    method: 'POST',
    body: JSON.stringify({
      embeds: [
        {
          type: 'rich',
          title: `"${quote}"`,
          color: 0xb3ede1,
          footer: {
            text: author,
          },
        },
      ],
    }),
  });
};

export default quote;
