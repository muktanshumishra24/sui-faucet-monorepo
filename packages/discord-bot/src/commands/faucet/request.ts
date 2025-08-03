import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { Command } from '../index';
import { requestFaucet } from '../../services/api';
import { logger } from '../../utils/logger';

export const requestCommand: Command = {
  data: new SlashCommandBuilder()
    .setName('faucet')
    .setDescription('Request testnet tokens from the Sui faucet')
    .addStringOption(option =>
      option
        .setName('address')
        .setDescription('Your Sui wallet address')
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('amount')
        .setDescription('Amount of tokens to request (default: 1 SUI)')
        .setRequired(false)
    ),

  execute: async (interaction) => {
    await interaction.deferReply({ ephemeral: true });

    try {
      const address = interaction.options.getString('address', true);
      const amount = interaction.options.getString('amount') || '1';

      // Validate address format
      if (!address.startsWith('0x') || address.length !== 66) {
        await interaction.editReply({
          content: '❌ Invalid Sui wallet address. Please provide a valid 0x-prefixed address.',
        });
        return;
      }

      // Validate amount
      const amountNum = parseFloat(amount);
      if (isNaN(amountNum) || amountNum <= 0 || amountNum > 10) {
        await interaction.editReply({
          content: '❌ Invalid amount. Please provide a number between 0.1 and 10 SUI.',
        });
        return;
      }

      const embed = new EmbedBuilder()
        .setTitle('🪙 Sui Faucet Request')
        .setColor('#6fbcf0')
        .addFields(
          { name: 'Wallet Address', value: `\`${address}\``, inline: false },
          { name: 'Amount', value: `${amount} SUI`, inline: true },
          { name: 'Status', value: '⏳ Processing...', inline: true }
        )
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });

      // Make API request
      const response = await requestFaucet(address, amountNum);

      if (response.success) {
        embed
          .setColor('#00ff00')
          .setFields(
            { name: 'Wallet Address', value: `\`${address}\``, inline: false },
            { name: 'Amount', value: `${amount} SUI`, inline: true },
            { name: 'Status', value: '✅ Success!', inline: true },
            { name: 'Transaction', value: `[View on Explorer](${response.transactionUrl})`, inline: false }
          );
      } else {
        embed
          .setColor('#ff0000')
          .setFields(
            { name: 'Wallet Address', value: `\`${address}\``, inline: false },
            { name: 'Amount', value: `${amount} SUI`, inline: true },
            { name: 'Status', value: '❌ Failed', inline: true },
            { name: 'Error', value: response.error || 'Unknown error', inline: false }
          );
      }

      await interaction.editReply({ embeds: [embed] });

    } catch (error) {
      logger.error('Error in faucet command:', error);
      await interaction.editReply({
        content: '❌ An error occurred while processing your request. Please try again later.',
      });
    }
  },
}; 