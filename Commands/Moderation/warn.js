const {
  SlashCommandBuilder,
  PermissionsBitField,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const warningSchema = require("../../Schemas/warnSchema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("warn")
    .setDescription("This warns a server member")
    .addSubcommand((command) =>
      command
        .setName("user")
        .setDescription(
          `warn a user for his mistake or breaking any kind of rule`
        )
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("The user you want to warn")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("reason")
            .setDescription("This is the reason for warning the user")
            .setRequired(false)
        )
    )
    .addSubcommand((command) =>
      command
        .setName("clear")
        .setDescription("This clears a members warnings")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("The user you want to clear the warnings of")
            .setRequired(true)
        )
    )
    .addSubcommand((command) =>
      command
        .setName("show")
        .setDescription("This gets a members warnings")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("The member you want to check the warns of")
            .setRequired(true)
        )
    ),
  async execute(interaction, client) {
    const sub = interaction.options.getSubcommand();

    switch (sub) {
      case "user":
        if (
          !interaction.member.permissions.has(
            PermissionsBitField.Flags.KickMembers
          )
        )
          return await interaction.reply({
            content: "You don't have permission to warn people!",
            ephemeral: true,
          });

        const { options, guildId, user } = interaction;

        const target = options.getUser("user");
        const reason = options.getString("reason") || "No reason given";

        const userTag = `${target.username}#${target.discriminator}`;

        warningSchema.findOne(
          { GuildID: guildId, UserID: target.id, UserTag: userTag },
          async (err, data) => {
            if (err) throw err;

            if (!data) {
              data = new warningSchema({
                GuildID: guildId,
                UserID: target.id,
                UserTag: userTag,
                Content: [
                  {
                    ExecuterId: user.id,
                    ExecuterTag: user.tag,
                    Reason: reason,
                  },
                ],
              });
            } else {
              const warnContent = {
                ExecuterId: user.id,
                ExecuterTag: user.tag,
                Reason: reason,
              };
              data.Content.push(warnContent);
            }
            data.save();
          }
        );

        const embed = new EmbedBuilder()
          .setColor(client.config.embed)
          .setTitle(`<:WarningIcon:1078385907457065130> Important Notice`)
          .setDescription(
            `You have been warned in ${interaction.guild.name} by <@${interaction.user.id}>\nFor: \`${reason}\``
          );

        const embed2 = new EmbedBuilder()
          .setColor(client.config.embed)
          .setDescription(
            `✅ ${target.tag} has been **warned** | ${reason}`
          );

        target.send({ embeds: [embed] }).catch((err) => {
          return;
        });

        interaction.reply({ embeds: [embed2] });
    }

    switch (sub) {
      case "clear":
        if (
          !interaction.member.permissions.has(
            PermissionsBitField.Flags.KickMembers
          )
        )
          return await interaction.reply({
            content: "You don't have permission to clear people's warnings!",
            ephemeral: true,
          });

        const { options, guildId, user } = interaction;

        const target = options.getUser("user");

        const embed = new EmbedBuilder();

        warningSchema.findOne(
          { GuildID: guildId, UserID: target.id, UserTag: target.tag },
          async (err, data) => {
            if (err) throw err;

            if (data) {
              await warningSchema.findOneAndDelete({
                GuildID: guildId,
                UserID: target.id,
                UserTag: target.tag,
              });

              embed
                .setColor(client.config.embed)
                .setDescription(
                  `✅ ${target.tag}'s warnings have been cleared`
                );

              interaction.reply({ embeds: [embed] });
            } else {
              interaction.reply({
                content: `${target.tag} has no warnings to be cleared`,
                ephemeral: true,
              });
            }
          }
        );
    }

    switch (sub) {
      case "show":
        const { options, guildId, user } = interaction;

        const target = options.getUser("user");

        const embed = new EmbedBuilder();
        const noWarns = new EmbedBuilder();

        warningSchema.findOne(
          { GuildID: guildId, UserID: target.id, UserTag: target.tag },
          async (err, data) => {
            if (err) throw err;

            if (data) {
              embed.setColor(client.config.embed).setDescription(
                `✅ ${
                  target.tag
                }'s warnings: \n${data.Content.map(
                  (w, i) =>
                    `
                            **Warning**: ${i + 1}
                            **Warning Moderator**: ${w.ExecuterTag}
                            **Warn Reason**: ${w.Reason}
                        `
                ).join(`-`)}`
              );

              interaction.reply({ embeds: [embed] });
            } else {
              noWarns
                .setColor(client.config.embed)
                .setDescription(
                  `✅ ${target.tag} has **0** warnings!`
                );

              interaction.reply({ embeds: [noWarns] });
            }
          }
        );
    }
  },
};
