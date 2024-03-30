const { EmbedBuilder } = require("discord.js");
const client = require("../../index.js");
module.exports = {
  name: "pause",
  aliases: ["ps"],
  args: true,
  owner: true,

  async execute(message, client, args) {
    const { member, guild } = message;
    const voiceChannel = member.voice.channel;
    const embed = new EmbedBuilder();

    if (!voiceChannel) {
      embed
        .setColor(client.config.embed)
        .setDescription(
          "❌ You must be in a voice channel to execute music commands."
        );
      return message.reply({ embeds: [embed] });
    }

    if (!member.voice.channelId == guild.members.me.voice.channelId) {
      embed
        .setColor(client.config.embed)
        .setDescription(
          `❌ You can't use the music player as it is already active in <#${guild.members.me.voice.channelId}`
        );
      return message.reply({ embeds: [embed] });
    }

    try {
      const queue = await client.distube.getQueue(voiceChannel);

      if (!queue) {
        embed.setColor(client.config.embed).setDescription(`📪 | There is no active queue`);
        return message.reply({ embeds: [embed] });
      }
      await queue.pause(voiceChannel);
      embed.setColor(client.config.embed).setDescription(`⏸ | The song has been paused.`);
      return message.reply({ embeds: [embed] });
    } catch (err) {
      console.log(err);

      embed
        .setColor("Red")
        .setDescription(
          `⛔ | Oops, Something went wrong...\n\nError Message:\n\`\`\`js\n${err}\`\`\``
        );

      return message.reply({ embeds: [embed] });
    }
  },
};
