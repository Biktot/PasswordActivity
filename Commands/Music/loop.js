const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const client = require("../../index");

module.exports = {
  data: new SlashCommandBuilder()
    .setName(`loop`)
    .setDescription(`Display loop options`)
    .addStringOption((option) =>
      option
        .setName(`options`)
        .setDescription(`Loop options: off,song, queue`)
        .addChoices(
          { name: `Off`, value: `off` },
          { name: `Song`, value: `off` },
          { name: `Queue`, value: `off` }
        )
        .setRequired(true)
    ),
  async execute(interaction, client) {
    const { member, options, guild } = interaction;
    const option = options.getString("options");
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

      let mode = null;

      switch (option) {
        case "off":
          mode = 0;
          break;
        case "song":
          mode = 1;
          break;
        case "queue":
          mode = 2;
          break;
      }

      mode = await queue.setRepeatMode(mode);

      mode = mode ? (mode === 2? "Repeat queue" : "Repeat song") : "Off";

      embed
        .setColor(client.config.embed)
        .setDescription(`🔁 | Set repeat mode to \`${mode}\`.`);
      await interaction.reply({ embeds: [embed] });
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
