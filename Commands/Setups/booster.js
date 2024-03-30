const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const boosterSchema = require("../../Schemas/boosterSchema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("booster-channel")
    .setDescription("configure your booster channel")
    .addSubcommand((command) =>
      command
        .setName("set")
        .setDescription("set your booster channel")
        .addChannelOption((option) =>
          option
            .setName("channel1")
            .setDescription("choose your channel for booster")
            .setRequired(true)
        )
        .addChannelOption((option) =>
          option
            .setName("channel2")
            .setDescription("log for your booster")
            .setRequired(true)
        )
    )
    .addSubcommand((command) =>
      command.setName("remove").setDescription("remove your booster channel")
    ),

  async execute(interaction, client) {
    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.Administrator
      )
    )
      return await interaction.reply({
        content: "You **do not** have permission to do that!",
        ephemeral: true,
      });

    const sub = interaction.options.getSubcommand();

    switch (sub) {
      case "set":
        const Channel1 = interaction.options.getChannel("channel1");
        const Channel2 = interaction.options.getChannel("channel2");

        const boosterdata = await boosterSchema.findOne({
          Guild: interaction.guild.id,
        });

        if (boosterdata)
          return interaction.reply({
            content: `You **already** have a booster channel (<#${boosterdata.Channel}>)`,
            ephemeral: true,
          });
        else {
          await boosterSchema.create({
            Guild: interaction.guild.id,
            Channel1: Channel1.id,
            Channel2: Channel2.id,
          });

          const embed = new EmbedBuilder()
            .setColor(client.config.embed)
            .setTitle(`> Your Booster Channel Has \n Been Set Successfully!`)
            .setAuthor({ name: `Booster Channel` })
            .setFooter({ text: `Enjoy Using Booster` })
            .setTimestamp()
            .setFields({
              name: `Channel was Set`,
              value: `>The channel ${Channel1} has been \n set as your Booster channel.`,
              inline: false,
            })
            .setThumbnail(client.user.displayAvatarURL({ dynamic: true }));

          await interaction.reply({ embeds: [embed] });
        }

        break;

      case "remove":
        if (
          !interaction.member.permissions.has(
            PermissionsBitField.Flags.Administrator
          )
        )
          return await interaction.reply({
            content: "You **do not** have permission to do that!",
            ephemeral: true,
          });

        const boosterdatas = await boosterSchema.findOne({
          Guild: interaction.guild.id,
        });

        if (!boosterdatas)
          return await interaction.reply({
            content: `You **do not** have a booster channel yet.`,
            ephemeral: true,
          });
        else {
          await boosterSchema.deleteMany({
            Guild: interaction.guild.id,
          });

          const embed1 = new EmbedBuilder()
            .setColor(client.config.embed)
            .setTitle(`> Your Booster Channel has \n been remoed successfully`)
            .setAuthor({ name: `Booster Channel` })
            .setFooter({ text: `Bay bay Booster` })
            .setTimestamp()
            .setFields({
              name: `Your channel was removed`,
              value: `> your channel for Booster has no longer in your server`,
              inline: false,
            })
            .setThumbnail(client.user.displayAvatarURL({ dynamic: true }));

          await interaction.reply({ embeds: [embed1] });
        }
    }
  },
};
