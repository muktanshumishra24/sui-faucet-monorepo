import { Client, Collection, SlashCommandBuilder } from 'discord.js';
import { requestCommand } from './faucet/request';
import { helpCommand } from './general/help';

export interface Command {
  data: SlashCommandBuilder;
  execute: (interaction: any) => Promise<void>;
}

export function loadCommands(client?: Client): any[] {
  const commands = [
    requestCommand,
    helpCommand,
  ];

  if (client) {
    commands.forEach(command => {
      client.commands.set(command.data.name, command);
    });
  }

  return commands.map(command => command.data.toJSON());
} 