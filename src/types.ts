import { InteractionType } from 'discord-interactions';
import { Request, Response } from 'express';

export interface Message {
  id: string;
  application_id: string;
  type: InteractionType;
  data: any;
  guild_id: string;
  channel: any;
  channel_id?: string;
  token: string;
  version: number;
  message?: any;
  app_permissions?: any;
  member?: any;
  user: any;
}

export type CommandFn = (
  res: Response,
  message?: Message,
  req?: Request
) => Promise<void>;

export type CommandMap = Record<string, CommandFn>;

export interface Quote {
  quote: string;
  author: string;
}

