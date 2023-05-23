import { CommandFn, CommandMap } from 'types.js';
import poll from './poll.js';
import quote from './quote.js';

const evidenceCommands: CommandMap = {
  poll,
  quote,
};

const evidence: CommandFn = async (res, message, req) => {
  if (!message) return;

  // the subcommand is held in the original command options
  const subcommand = message.data.options[0]?.name;
  evidenceCommands[subcommand]?.(res, message, req);
};

export default evidence;
