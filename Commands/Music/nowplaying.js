const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const client = require("../../index.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName(`nowplaying`)
    .setDescription(`Display info about the curently playing song in queue`),
  async execute(interaction, client) {
    const { member, guild } = interaction;
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

      const song = queue.songs[0];
      embed
        .setColor(client.config.embed)
        .setDescription(
          `🎶 **Currently playing:** \`${song.name}\` - \`${song.formattedDuration}\`.\n**Link:** ${song.url}`
        )
        .setThumbnail(song.thumbnail);
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
