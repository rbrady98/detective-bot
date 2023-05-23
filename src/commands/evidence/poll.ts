/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  InteractionResponseFlags,
  InteractionResponseType,
} from 'discord-interactions';

import { CommandFn, Quote } from 'types.js';
import { getGuildChannels } from './quote.js';
import { createPoll } from '../../strawpoll/strawpoll.js';

const poll: CommandFn = async (res, message) => {
  if (!message) return;
  console.log('inside the poll handler');

  res.status(200).send({
    type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content: 'Generating a poll',
      flags: InteractionResponseFlags.EPHEMERAL,
    },
  });

  const { guild_id, token } = message;

  // Get the evidence channel
  const channelID = await getEvidenceChannelID(guild_id);

  if (!channelID) {
    console.log('Could not find the evidence channel');
    res.status(400).send();
  }

  // Get the messages in the channel
  const messages = await getChannelMessages(channelID);
  const quotes = getQuoteList(messages);
  console.log('Creating a fake poll');
  console.log(quotes);
  // const pollURL = await createPoll(quotes);
  const pollURL = 'fake url';
  await updateDiscordMessage(`Poll available at: ${pollURL}`, token);
};

const getEvidenceChannelID = async (guild_id: string): Promise<string> => {
  const channels = await getGuildChannels(guild_id);

  let channelID = '';
  for (const channel of channels) {
    if (channel.name.toLowerCase() === 'evidence') {
      channelID = channel.id;
      break;
    }
  }

  return channelID;
};

const getChannelMessages = async (channelID: string): Promise<Array<any>> => {
  let json: any;

  try {
    const response = await fetch(
      `https://discord.com/api/v10/channels/${channelID}/messages`,
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

// Take an array of messages and convert them to quote
const getQuoteList = (messages: Array<any>): Array<Quote> => {
  return messages.map((m) => {
    const quote: Quote = { quote: '', author: '' };
    if (m.embeds?.length !== 0) {
      // This is a new style quote from app
      quote.quote = m.embeds[0].title.replace(/["]+/g, '');
      quote.author = m.embeds[0].footer.text;
    } else {
      const oldQuoteFormat = /"(.*)" - (.*)/g;
      const groups = oldQuoteFormat.exec(m.content);

      if (groups) {
        quote.quote = groups[1]
        quote.author = groups[2]
      }
    }

    return quote;
  });
};

const updateDiscordMessage = async (message: string, token: string) => {
  const URL = `https://discord.com/api/v10/webhooks/${process.env.APPLICATION_ID}/${token}/messages/@original`;

  try {
    const response = await fetch(URL, {
      headers: {
        Authorization: `Bot ${process.env.TOKEN}`,
        'Content-Type': 'application/json',
      },
      method: 'PATCH',
      body: JSON.stringify({ content: message }),
    });

    if (!response.ok) {
      console.log('Message could not be updated');
    }
  } catch (error) {
    console.error(error);
  }
};

export default poll;
