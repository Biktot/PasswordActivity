const {
  ContextMenuCommandBuilder,
  ApplicationCommandType,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  data: new ContextMenuCommandBuilder()
    .setName("Avatar")
    .setType(ApplicationCommandType.User)
    .setDMPermission(false),
  async execute(interaction, client) {
    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(client.config.embed)
          .setTimestamp()
          .setImage(interaction.targetUser.displayAvatarURL())
          .setTitle(`${interaction.targetUser.username}'s Avatar`),
      ],
      ephemeral: true,
    });
  },
};
