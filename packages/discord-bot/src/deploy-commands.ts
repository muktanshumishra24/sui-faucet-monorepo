import { REST, Routes } from 'discord.js';
import { config } from 'dotenv';
import { logger } from './utils/logger';
import { loadCommands } from './commands';

config();

const commands = loadCommands();

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN!);

(async () => {
  try {
    logger.info('Started refreshing application (/) commands.');

    const clientId = process.env.DISCORD_CLIENT_ID;
    const guildId = process.env.DISCORD_GUILD_ID;

    if (!clientId) {
      throw new Error('DISCORD_CLIENT_ID is not set');
    }

    if (guildId) {
      // Deploy to specific guild (faster for development)
      await rest.put(
        Routes.applicationGuildCommands(clientId, guildId),
        { body: commands }
      );
      logger.info(`Successfully reloaded application (/) commands for guild ${guildId}.`);
    } else {
      // Deploy globally
      await rest.put(
        Routes.applicationCommands(clientId),
        { body: commands }
      );
      logger.info('Successfully reloaded application (/) commands globally.');
    }
  } catch (error) {
    logger.error('Error deploying commands:', error);
  }
})(); 