const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDMPermission(false)
    .setDescription("Bans specified user.")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("Specify the user you want to ban.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("Reason as to why you want to ban specified user.")
        .setRequired(false)
    ),
  async execute(interaction, client) {
    const users = interaction.options.getUser("user");
    const ID = users.id;
    const banUser = client.users.cache.get(ID);
    const banmember = interaction.options.getMember("user");

    if (
      !interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)
    )
      return await interaction.reply({
        content: "You **do not** have the permission to do that!",
        ephemeral: true,
      });
    if (interaction.member.id === ID)
      return await interaction.reply({
        content: "You **cannot** use the hammer on you, silly goose..",
        ephemeral: true,
      });

    if (!banmember)
      return await interaction.reply({
        content: `That user **does not** exist within your server.`,
        ephemeral: true,
      });

    let reason = interaction.options.getString("reason");
    if (!reason) reason = "No reason provided :(";

    const dmembed = new EmbedBuilder()
      .setColor(client.config.embed)
      .setAuthor({ name: "🔨 Ban Tool" })
      .setTitle(`> You were banned from "${interaction.guild.name}"`)
      .addFields({
        name: "• Server",
        value: `> ${interaction.guild.name}`,
        inline: true,
      })
      .addFields({ name: "• Reason", value: `> ${reason}`, inline: true })
      .setFooter({ text: "🔨 The ban hammer strikes again" })
      .setTimestamp()
      .setThumbnail(client.user.displayAvatarURL({ dynamic: true }));

    const embed = new EmbedBuilder()
      .setColor(client.config.embed)
      .setAuthor({ name: "🔨 Ban Tool" })
      .setTitle(`> User was bannished!`)
      .addFields({ name: "• User", value: `> ${banUser.tag}`, inline: true })
      .addFields({ name: "• Reason", value: `> ${reason}`, inline: true })
      .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
      .setFooter({ text: "🔨 The ban hammer strikes again" })
      .setTimestamp();

    await interaction.guild.bans.create(banUser.id, { reason }).catch((err) => {
      return interaction.reply({
        content: `**Couldn't** ban this member! Check my **role position** and try again.`,
        ephemeral: true,
      });
    });

    await banUser.send({ embeds: [dmembed] }).catch((err) => {
      return;
    });

    await interaction.reply({ embeds: [embed] });
  },
};
