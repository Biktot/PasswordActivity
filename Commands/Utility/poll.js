const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
  ChannelType,
} = require("discord.js");
const pollschema = require("../../Schemas/votesetup");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("poll")
    .setDescription("Configure your poll system.")
    .setDMPermission(false)
    .addSubcommand((command) =>
      command
        .setName("setup")
        .setDescription(
          "Sets up your poll system. Messages sent to specified channel will become polls."
        )
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription("Specified channel will become your poll channel.")
            .setRequired(false)
            .addChannelTypes(
              ChannelType.GuildAnnouncement,
              ChannelType.GuildText
            )
        )
    )
    .addSubcommand((command) =>
      command
        .setName("disable")
        .setDescription("Disables the poll system for you.")
    ),
  async execute(interaction, client) {
    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.Administrator
      ) &&
      interaction.user.id !== "619944734776885276"
    )
      return await interaction.reply({
        content: "You **do not** have the permission to do that!",
        ephemeral: true,
      });

    const sub = await interaction.options.getSubcommand();
    const data = await pollschema.findOne({ Guild: interaction.guild.id });

    switch (sub) {
      case "setup":
        if (data)
          return await interaction.reply({
            content: `You have **already** enabled the **poll system** within this server. \n> Do **/poll disable** to undo.`,
            ephemeral: true,
          });
        else {
          const channel =
            (await interaction.options.getChannel("channel")) ||
            interaction.channel;

          const setupembed = new EmbedBuilder()
            .setColor(client.config.embed)
            .setAuthor({ name: `🤚 Poll System` })
            .setFooter({ text: `🤚 Poll Enabled` })
            .setTitle("> Polls were Enabled")
            .addFields({
              name: `• Polls Enabled`,
              value: `> Polls were enabled. You will now \n> be able to convert all messages sent \n> within your channel into fancy embeded polls.`,
            })
            .addFields({ name: `• Channel`, value: `> ${channel}` })
            .setTimestamp();

          await interaction.reply({ embeds: [setupembed] });

          await pollschema.create({
            Guild: interaction.guild.id,
            Channel: channel.id,
          });
        }

        break;
      case "disable":
        if (!data)
          return await interaction.reply({
            content: `You have **not** enabled the **poll system** within this server.`,
            ephemeral: true,
          });
        else {
          const disablembed = new EmbedBuilder()
            .setColor(client.config.embed)
            .setAuthor({ name: `🤚 Poll System` })
            .setFooter({ text: `🤚 Poll Disabled` })
            .setTitle("> Polls were Disabled")
            .addFields({
              name: `• Polls Disabled`,
              value: `> Polls were Disabled. You will no longer \n> be able to convert messages sent \n> to <#${data.Channel}> into fancy embeded polls.`,
            })
            .setTimestamp();

          await interaction.reply({ embeds: [disablembed] });

          await pollschema.deleteMany({
            Guild: interaction.guild.id,
          });
        }
    }
  },
};
