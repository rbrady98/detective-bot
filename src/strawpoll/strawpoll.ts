import axios from 'axios';
import { Quote } from 'types.js';
import { CreatePollRequest, TextPollOption } from './types.js';

const ENDPOINT = 'https://api.strawpoll.com/v3';
const API_KEY = process.env.STRAWPOLL_API_KEY;

if (!API_KEY) {
  console.error('missing strawpoll api key');
  process.exit(1);
}

const strawpollClient = axios.create({
  baseURL: ENDPOINT,
  headers: {
    'X-API-Key': API_KEY,
  },
});

export const createPoll = async (quotes: Array<Quote>) => {
  const values = createPollOptions(quotes);
  let pollURL = '';
  const body: CreatePollRequest = {
    title: `CBN Quote of the Year ${new Date().getFullYear()}`,
    type: 'multiple_choice',
    poll_options: values,
    poll_config: {
      is_multiple_choice: true,
      multiple_choice_min: 1,
      multiple_choice_max: 5,
      randomize_options: true,
      results_visibility: 'never',
    },
  };

  try {
    const res = await strawpollClient.post('/polls', body);
    pollURL = res.data.url;
  } catch (e) {
    console.error(e);
  }

  return pollURL;
};

const createPollOptions = (quotes: Array<Quote>) => {
  const options = quotes.map(
    (quote): TextPollOption => ({
      type: 'text',
      value: quote.quote,
      description: quote.author,
    })
  );

  return options;
};
