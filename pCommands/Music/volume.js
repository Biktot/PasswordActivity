const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "volume",
  aliases: ["vol"],
  args: true,
  owner: false,

  async execute(message, client, args) {
    const arg = parseInt(args[0]);
    if (isNaN(arg) || !Number.isInteger(arg)) {
      return message.reply("Please provide a valid integer. (Ex: 10 = 10%)");
    }
    if (arg < 0 || arg > 100) {
      return message.reply("Please provide an integer between 0 and 100.");
    }
    const { member, guild, options } = message;
    const voiceChannel = member.voice.channel;
    const embed = new EmbedBuilder();

    if (!voiceChannel) {
      embed
        .setColor(client.config.embed)
        .setDescription(
          "❌ You must be in a voice channel to execute music commands."
        );
      return message.reply({ embeds: [embed], ephemeral: true });
    }

    if (!member.voice.channelId == guild.members.me.voice.channelId) {
      embed
        .setColor(client.config.embed)
        .setDescription(
          `❌ You can't use the music player as it is already active in <#${guild.members.me.voice.channelId}`
        );
      return message.reply({ embeds: [embed], ephemeral: true });
    }

    try {
      const queue = await client.distube.getQueue(voiceChannel);

      if (!queue) {
        embed.setColor(client.config.embed).setDescription(`📪 | There is no active queue`);
        return message.reply({ embeds: [embed] });
      }

      client.distube.setVolume(voiceChannel, arg);
      return message.reply({
        content: `🔊 Volume has been set to ${arg}%`,
      });
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
