const { SlashCommandBuilder } = require('@discordjs/builders');
const { getVoiceConnection, joinVoiceChannel } = require('@discordjs/voice');
const Settings = require('../../Schemas/247');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('247')
    .setDescription('Toggle 24/7 mode for the bot'),

  async execute(interaction, client) {
    const guildId = interaction.guild.id;
    let settings = await Settings.findOne({ guildId });

    if (!settings) {
      settings = await Settings.create({ guildId, is247Enabled: true });
    }

    settings.is247Enabled = !settings.is247Enabled;
    await settings.save();

    const status = settings.is247Enabled ? 'enabled' : 'disabled';
    await interaction.reply(`24/7 mode has been ${status} for this server.`);

    const voiceChannel = interaction.member.voice.channel;
    const connection = getVoiceConnection(guildId);

    if (settings.is247Enabled && voiceChannel && !connection) {
      const player = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: voiceChannel.guild.id,
        adapterCreator: voiceChannel.guild.voiceAdapterCreator,
      });

      player.on('error', console.error);

      // Periodically check if the bot is still connected
      const checkInterval = setInterval(() => {
        const updatedConnection = getVoiceConnection(guildId);
        if (!updatedConnection) {
          // Rejoin the voice channel if the connection is lost
          joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: voiceChannel.guild.id,
            adapterCreator: voiceChannel.guild.voiceAdapterCreator,
          });
        }
      }, 60000); // Check every 60 seconds

      // Store the check interval in settings for later use
      settings.checkInterval = checkInterval;
      await settings.save();
    } else if (!settings.is247Enabled && connection) {
      // Clear the check interval and destroy the connection if 24/7 mode is disabled
      clearInterval(settings.checkInterval);
      connection.destroy();
    } else if (settings.is247Enabled && !voiceChannel) {
      await interaction.reply('You need to be in a voice channel to use this command.');
    }
  },
};
