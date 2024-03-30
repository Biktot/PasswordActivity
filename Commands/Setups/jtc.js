const {
  SlashCommandBuilder,
  PermissionsBitField,
  EmbedBuilder,
  ChannelType,
} = require("discord.js");
const voiceschema = require("../../Schemas/jointocreate");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("join-to-create")
    .setDescription("Configure your join to create voice channel.")
    .setDMPermission(false)
    .addSubcommand((command) =>
      command
        .setName("setup")
        .setDescription("Sets up your join to create voice channel.")
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription(
              "Specified channel will be your join to create voice channel."
            )
            .setRequired(true)
            .addChannelTypes(ChannelType.GuildVoice)
        )
        .addChannelOption((option) =>
          option
            .setName("category")
            .setDescription(
              "All new channels will be created in specified category."
            )
            .setRequired(true)
            .addChannelTypes(ChannelType.GuildCategory)
        )
        .addIntegerOption((option) =>
          option
            .setName("voice-limit")
            .setDescription("Set the default limit for the new voice channels.")
            .setMinValue(2)
            .setMaxValue(10)
        )
    )
    .addSubcommand((command) =>
      command
        .setName("disable")
        .setDescription("Disables your join to create voice channel system.")
    ),
  async execute(interaction, client) {
    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.Administrator
      ) &&
      interaction.user.id !== "536944480469909569"
    )
      return await interaction.reply({
        content: "You **do not** have the permission to do that!",
        ephemeral: true,
      });

    const data = await voiceschema.findOne({ Guild: interaction.guild.id });
    const sub = interaction.options.getSubcommand();

    switch (sub) {
      case "setup":
        if (data)
          return await interaction.reply({
            content: `You have **already** set up the **join to create** system! \n> Do **/join-to-create disable** to undo.`,
            ephemeral: true,
          });
        else {
          const channel = await interaction.options.getChannel("channel");
          const category = await interaction.options.getChannel("category");
          const limit =
            (await interaction.options.getInteger("voice-limit")) || 3;

          await voiceschema.create({
            Guild: interaction.guild.id,
            Channel: channel.id,
            Category: category.id,
            VoiceLimit: limit,
          });

          const setupembed = new EmbedBuilder()
            .setColor(client.config.embed)
            .setAuthor({ name: `🔊 Join to Create system` })
            .setFooter({ text: `🔊 System Setup` })
            .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
            .setTimestamp()
            .addFields({
              name: `• Join to Create was Enabled`,
              value: `> Your channel (${channel}) will now act as \n> your join to create channel.`,
            })
            .addFields({ name: `• Category`, value: `> ${category}` })
            .addFields({
              name: `• Voice Limit`,
              value: `> **${limit}**`,
              inline: true,
            });

          await interaction.reply({ embeds: [setupembed] });
        }

        break;
      case "disable":
        if (!data)
          return await interaction.reply({
            content: `You **do not** have the **join to create** system **set up**, cannot delete **nothing**..`,
            ephemeral: true,
          });
        else {
          const removeembed = new EmbedBuilder()
            .setColor(client.config.embed)
            .setAuthor({ name: `🔊 Join to Create system` })
            .setFooter({ text: `🔊 System Disabled` })
            .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
            .setTimestamp()
            .addFields({
              name: `• Join to Create was Disabled`,
              value: `> Your channel (<#${data.Channel}>) will no longer act as \n> your join to create channel.`,
            });

          await voiceschema.deleteMany({ Guild: interaction.guild.id });

          await interaction.reply({ embeds: [removeembed] });
        }
    }
  },
};
