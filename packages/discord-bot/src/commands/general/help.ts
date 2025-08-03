import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { Command } from '../index';

export const helpCommand: Command = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Show available commands and usage information'),

  execute: async (interaction) => {
    const embed = new EmbedBuilder()
      .setTitle('🪙 Sui Faucet Bot Help')
      .setColor('#6fbcf0')
      .setDescription('Welcome to the Sui Testnet Faucet Bot! Here are the available commands:')
      .addFields(
        {
          name: '/faucet',
          value: 'Request testnet tokens from the Sui faucet\n**Usage:** `/faucet address:0x... amount:1`\n**Parameters:**\n• `address` - Your Sui wallet address (required)\n• `amount` - Amount of SUI to request (optional, default: 1)',
          inline: false
        },
        {
          name: '/help',
          value: 'Show this help message',
          inline: false
        }
      )
      .addFields(
        {
          name: '📋 Requirements',
          value: '• Valid Sui wallet address (0x-prefixed)\n• Amount between 0.1 and 10 SUI\n• Rate limit: 3 requests per 15 minutes',
          inline: false
        },
        {
          name: '🔗 Useful Links',
          value: '[Sui Explorer](https://suiexplorer.com)\n[Sui Documentation](https://docs.sui.io)\n[Discord Server](https://discord.gg/sui)',
          inline: false
        }
      )
      .setFooter({ text: 'Sui Faucet Bot - Powered by Sui Foundation' })
      .setTimestamp();

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
}; 