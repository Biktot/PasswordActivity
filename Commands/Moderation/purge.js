const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('purge')
    .setDescription('Deletes messages in the channel')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addSubcommand(subcommand =>
      subcommand
        .setName('bot')
        .setDescription('Deletes messages sent by bots')
        .addIntegerOption(option =>
          option.setName('limit')
            .setDescription('The maximum number of messages to delete')
            .setMaxValue(99)
            .setRequired(true)))
    .addSubcommand(subcommand =>
      subcommand
        .setName('human')
        .setDescription('Deletes messages sent by humans')
        .addIntegerOption(option =>
          option.setName('limit')
            .setDescription('The maximum number of messages to delete')
            .setMaxValue(99)
            .setRequired(true)))
    .addSubcommand(subcommand =>
      subcommand
        .setName('all')
        .setDescription('Deletes all messages in the channel')
        .addIntegerOption(option =>
          option.setName('limit')
            .setDescription('The maximum number of messages to delete')
            .setMaxValue(99)
            .setRequired(true))),

  async execute(interaction, client) {
    const { options } = interaction;
    const subcommand = options.getSubcommand();
    const limit = options.getInteger('limit');
    let messages;

    switch (subcommand) {
      case 'bot':
        messages = await interaction.channel.messages.fetch({ limit });
        messages = messages.filter(msg => msg.author.bot);
        break;
      case 'human':
        messages = await interaction.channel.messages.fetch({ limit });
        messages = messages.filter(msg => !msg.author.bot);
        break;
      case 'all':
        messages = await interaction.channel.messages.fetch({ limit: limit + 1 });
        break;
    }

    messages.forEach(async msg => {
      await msg.delete().catch(console.error);
    });

    await interaction.reply(`## 🗑️ | Deleted ${messages.size} messages.`);
  },
};
