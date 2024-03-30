const { ButtonBuilder, ActionRowBuilder, EmbedBuilder, SlashCommandBuilder, ButtonStyle } = require('discord.js');
const client = require('../../index');

module.exports = {
  name: "play",
  aliases: ["p"],
  args: true,
  owner: false,

  async execute(message, client, args) {
    const query = args.join(" ");

    const { options, member, guild, channel } = message;

    const voiceChannel = member.voice.channel;

    const embed = new EmbedBuilder();

    if (!voiceChannel) {
      embed.setColor(client.config.embed).setDescription('You must be in a voice channel to execute music commands.');
      return message.reply({ embeds: [embed] });
    }

    if (!member.voice.channelId == guild.members.me.voice.channelId) {
      embed.setColor(client.config.embed).setDescription(`You can't use the music player as it is already active in <#${guild.members.me.voice.channelId}>`);
      return message.reply({ embeds: [embed] });
    }

    try {
      client.distube.play(voiceChannel, query, { textChannel: channel, member: member });

      const pauseButton = new ButtonBuilder()
        .setCustomId('pause')
        .setLabel('Pause')
        .setStyle(ButtonStyle.Secondary);

      const resumeButton = new ButtonBuilder()
        .setCustomId('resume')
        .setLabel('Resume')
        .setStyle(ButtonStyle.Secondary);

      const skipButton = new ButtonBuilder()
        .setCustomId('skip')
        .setLabel('Skip')
        .setStyle(ButtonStyle.Danger);

      const shuffleButton = new ButtonBuilder()
        .setCustomId('shuffle')
        .setLabel('Shuffle')
        .setStyle(ButtonStyle.Primary);

      const stopButton = new ButtonBuilder()
        .setCustomId('stop')
        .setLabel('Stop')
        .setStyle(ButtonStyle.Danger);

      const loopButton = new ButtonBuilder()
        .setCustomId('loop')
        .setLabel('Loop')
        .setStyle(ButtonStyle.Success);

      const row1 = new ActionRowBuilder()
        .addComponents(pauseButton, resumeButton, skipButton);

      const row2 = new ActionRowBuilder()
        .addComponents(shuffleButton, stopButton, loopButton);

      embed.setColor(client.config.embed).setDescription('🎵 | You can Control Music with buttons.');

      const message1 = await message.reply({ embeds: [embed], components: [row1, row2] });

      // Add a listener for button interactions
      const filter = (i) => ['pause', 'resume', 'skip', 'shuffle', 'stop', 'loop'].includes(i.customId) && i.user.id === interaction.user.id;
      const collector = message1.createMessageComponentCollector({ filter, time: 1500000 });

      collector.on('collect', async (i) => {
        if (i.customId === 'pause') {
          client.distube.pause(guild);
          embed.setDescription('⏸ Music paused.');
          await i.update({ embeds: [embed] });
        } else if (i.customId === 'resume') {
          client.distube.resume(guild);
          embed.setDescription('▶️ Music resumed.');
          await i.update({ embeds: [embed] });
        } else if (i.customId === 'skip') {
          client.distube.skip(guild);
          embed.setDescription('⏭️ Song skipped.');
          await i.update({ embeds: [embed] });
        } else if (i.customId === 'shuffle') {
          client.distube.shuffle(guild);
          embed.setDescription('🔀 Queue shuffled.');
          await i.update({ embeds: [embed] });
        } else if (i.customId === 'stop') {
          client.distube.stop(guild);
          embed.setDescription('⏹️ Music stopped.');
          await i.update({ embeds: [embed] });
        } else if (i.customId === 'loop') {
          const toggle = client.distube.toggleAutoplay(guild);
          embed.setDescription(`🔁 Loop ${toggle ? 'enabled' : 'disabled'}.`);
          await i.update({ embeds: [embed] });
        }
      });

      collector.on('end', () => {
        // Remove the buttons after the collector expires
        message1.edit({ components: [] });
      });
    } catch (err) {
      console.log(err);

      embed.setColor(client.config.embed).setDescription('⛔ | Something went wrong...');

      return message.reply({ embeds: [embed] });
    }
  },
};
