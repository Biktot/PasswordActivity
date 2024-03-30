const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
} = require("discord.js");
const phoneschema = require("../../Schemas/phoneschema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("multiguild-messaging")
    .setDescription("Config your phoning system.")
    .addSubcommand((command) =>
      command
        .setName("setup")
        .setDescription("Sets up the phoning system for you.")
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription("Specified channel will be your phoning channel.")
            .setRequired(true)
        )
    )
    .addSubcommand((command) =>
      command
        .setName("disable")
        .setDescription("Disables the phoning system for your server.")
    ),
  async execute(interaction, client) {
    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.Administrator
      )
    )
      return await interaction.reply({
        content: "You **do not** have the permission to do that!",
        ephemeral: true,
      });

    const sub = interaction.options.getSubcommand();
    const channel = interaction.options.getChannel("channel");
    const data = await phoneschema.findOne({ Guild: interaction.guild.id });

    switch (sub) {
      case "setup":
        if (data)
          return await interaction.reply({
            content: `You **already** have a phoning system set up in this server!`,
            ephemeral: true,
          });
        else {
          phoneschema.create({
            Guild: interaction.guild.id,
            Channel: channel.id,
            Setup: "defined",
          });

          const embed = new EmbedBuilder()
            .setColor(client.config.embed)
            .setTimestamp()
            .setTitle("> Multi Guild Messaging Setup")
            .setAuthor({ name: `📞 Multi Guild Messaging System` })
            .setFooter({ text: `📞 Multi Guild Messaging was Setup` })

            .addFields({
              name: `• System Setup`,
              value: `> Your channel (${channel}) was set up to be \n> your phoning channel!`,
            });

          await interaction.reply({ embeds: [embed] });
          channel
            .send(
              "This channel has been **set up** to be a **Multi Guild Messaging** channel!"
            )
            .catch((err) => {
              return;
            });
        }

        break;

      case "disable":
        if (!data)
          return await interaction.reply({
            content: `No **phoning system** found, cannot delete nothing..`,
            ephemeral: true,
          });
        else {
          await phoneschema.deleteMany({ Guild: interaction.guild.id });

          await interaction.reply({
            content: `Your **phoning system** has been disabled!`,
            ephemeral: true,
          });
        }
    }
  },
};
