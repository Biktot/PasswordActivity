const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const client = require("../../index.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName(`rewind`)
    .setDescription(`rewind seconds in a song. 🎶`)
    .addIntegerOption((option) =>
      option
        .setName(`seconds`)
        .setDescription("Amount of seconds to rewind. (10 = 10s)")
        .setMinValue(0)
        .setRequired(true)
    ),
  async execute(interaction, client) {
    const { options, member, guild } = interaction;
    const seconds = option.getInteger('seconds');
    const voiceChannel = member.voice.channel;
    const embed = new EmbedBuilder();

    if (!voiceChannel) {
      embed
        .setColor(client.config.embed)
        .setDescription(
          "❌ You must be in a voice channel to execute music commands."
        );
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    if (!member.voice.channelId == guild.members.me.voice.channelId) {
      embed
        .setColor(client.config.embed)
        .setDescription(
          `❌ You can't use the music player as it is already active in <#${guild.members.me.voice.channelId}`
        );
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    try {
      const queue = await client.distube.getQueue(voiceChannel);

      if (!queue) {
        embed.setColor(client.config.embed).setDescription(`📪 | There is no active queue`);
        return interaction.reply({ embeds: [embed], ephemeral: false });
      }

      await queue.seek(queue.currentTime - seconds);
      embed.setColor(client.config.embed).setDescription(`⏪ | Rewinded the song for \`${seconds}s\`.`);
      return interaction.reply({ embeds: [embed], ephemeral: false });
    } catch (err) {
      console.log(err);

      embed
        .setColor("Red")
        .setDescription(
          `⛔ | Oops, Something went wrong...\n\nError Message:\n\`\`\`js\n${err}\`\`\``
        );

      return interaction.reply({ embeds: [embed], ephemeral: false });
    }
  },
};
