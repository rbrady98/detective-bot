// Handle registers all commands to a
// map and uses the command name as lookup.

import { CommandMap } from 'types.js';
import evidence from './evidence/index.js';

const commands: CommandMap = {
  evidence,
};

export default commands;
