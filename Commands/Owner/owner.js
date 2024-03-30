const {
  SlashCommandBuilder,
  PermissionsBitField,
  EmbedBuilder,
  CommandInteraction,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  PermissionFlagsBits,
  TextInputBuilder,
  TextInputStyle,
  ModalBuilder,
} = require("discord.js");
const cooldown = new Set();

module.exports = {
  data: new SlashCommandBuilder()
    .setName(`owner`)
    .setDescription(`owner only commands`)
    .addSubcommand((command) =>
      command
        .setName(`blacklist-add`)
        .setDescription(`Adds a user to the blacklist`)
        .addStringOption((option) =>
          option
            .setName("userid")
            .setDescription("The user to add to the blacklist")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("reason")
            .setDescription("The reason for the blacklist")
            .setRequired(false)
        )
    )
    .addSubcommand((command) =>
      command
        .setName(`blacklist-remove`)
        .setDescription(`Removes a user from the blacklist`)
        .addStringOption((option) =>
          option
            .setName("user")
            .setDescription("The user to remove from the blacklist")
            .setRequired(true)
        )
    )
    .addSubcommand((command) =>
      command
        .setName(`send-changelogs`)
        .setDescription(`Send a new bot changelogs`)
    )
    .addSubcommand((command) =>
      command
        .setName(`restart`)
        .setDescription(`Shuts down and restarts bots (developer only)`)
    )
    .addSubcommand((command) =>
      command
        .setName(`servers`)
        .setDescription(`shows in how many servers the bot is in.`)
    )
    .addSubcommand((command) =>
      command
        .setName(`leave-server`)
        .setDescription(`leave a server in which bot is.`)
        .addStringOption((option) =>
          option
            .setName("serverid")
            .setDescription("The ID of the server to leave")
            .setRequired(true)
        )
    ),
  ownerOnly: true,
  async execute(interaction, client) {
    const sub = interaction.options.getSubcommand();

    switch (sub) {
      case "blacklist-add":
        const blacklistDB = require("../../Schemas/blacklistSchema");

        const useridOption = interaction.options.getString("userid");
        const reasonOption =
          interaction.options.getString("reason") || "No reason provided";
        const errorArray = [];

        const blacklist = await blacklistDB.findOne({ userId: useridOption });

        const removeButton = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setLabel("Remove")
            .setStyle(ButtonStyle.Danger)
            .setCustomId("remove")
        );

        const embed = new EmbedBuilder()
          .setTitle("BlackList")
          .setColor(client.config.embed)
          .setDescription(
            `Successfully added user to blacklist with the reason: ${reasonOption}`
          );

        if (blacklist) {
          errorArray.push("That user is already blacklisted");
        }
        if (errorArray.length) {
          const errorEmbed = new EmbedBuilder()
            .setDescription(
              `<:incorrect:1087980863859462195> There was an error when adding user to blacklist.\nError(s):\n ${errorArray.join(
                `\n`
              )}`
            )
            .setColor(client.config.embed);
          await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
          return;
        } else {
          await blacklistDB.create({
            userId: useridOption,
            reason: reasonOption,
          });

          await interaction.reply({
            embeds: [embed],
            components: [removeButton],
          });

          const removeEmbed = new EmbedBuilder()
            .setTitle("BlackList")
            .setDescription("Successfully removed user from blacklist")
            .setColor(client.config.embed);

          const collector = interaction.channel.createMessageComponentCollector(
            { time: 60000 }
          );

          collector.on("collect", async (i) => {
            if (i.customId === "remove") {
              if (i.user.id !== interaction.user.id) {
                return await i.reply({
                  content: `Only ${interaction.client.user.username} can use this command!`,
                  ephemeral: true,
                });
              }
              await blacklistDB.deleteOne({ userId: useridOption });
              await i.update({ embeds: [removeEmbed], components: [] });
            }
          });

          collector.on("end", (collected) => {
            console.log(`Collected ${collected.size} interactions.`);
          });
        }
    }

    switch (sub) {
      case "blacklist-remove":
        const blacklistDB = require("../../Schemas/blacklistSchema");

        const user = interaction.options.getString("user");

        const embed = new EmbedBuilder()
          .setTitle("Blacklist")
          .setColor(client.config.embed)
          .setDescription("Successfully removed the user from the blacklist");

        try {
          await blacklistDB.findOneAndDelete({ userId: user });
          interaction.reply({ embeds: [embed] });
        } catch (error) {
          console.error(error);
        }
    }

    switch (sub) {
      case "restart":
        if (interaction.user.id === `${client.config.developerid}`) {
          await interaction.reply({
            content: `**Shutting down..**`,
            ephemeral: true,
          });
          await client.user.setStatus("invisible");
          process.exit();
        } else {
          return interaction.reply({
            content: `Only **the owner** of ${client.user} can use this command.`,
            ephemeral: true,
          });
        }
    }

    switch (sub) {
      case "servers":
        const guilds = client.guilds.cache;
        let guildList = '';
 
        guilds.forEach((guild) => {
            const owner = guild.members.cache.get(guild.ownerId);
            guildList += `**Guild**: ${guild.name} (${guild.id})\n`;
            guildList += `**Members**: ${guild.memberCount}\n`;
            guildList += `**Owner**: ${owner.user.tag} (${owner.user.id})\n\n`;
        });
 
        const embed = new EmbedBuilder()
            .setTitle('Guilds')
            .setDescription(guildList)
            .setColor(client.config.embed)
            .setTimestamp();
 
        await interaction.reply({ embeds: [embed], ephemeral: true });
    }

    switch (sub) {
      case "leave-server":
        const serverId = interaction.options.getString("serverid");

        try {
          const guild = await interaction.client.guilds.fetch(serverId);
          await guild.leave();

          const embed = new EmbedBuilder()
            .setTitle("Server Left")
            .setDescription(
              `Successfully left the server with ID \`${serverId}\``
            )
            .setColor("Green")
            .setTimestamp();

          await interaction.reply({ embeds: [embed] });
        } catch (error) {
          const embed = new EmbedBuilder()
            .setTitle("Error")
            .setDescription(
              `An error occurred while leaving the server: \`${error}\``
            )
            .setColor("Red")
            .setTimestamp();

          await interaction.reply({ embeds: [embed] });
        }
    }

    switch (sub) {
      case "send-changelogs":
        const modal = new ModalBuilder()
          .setCustomId("changelogs")
          .setTitle("Send changelogs");

        const title = new TextInputBuilder()
          .setCustomId("changelogs-title")
          .setLabel("Changelogs title")
          .setStyle(TextInputStyle.Short)
          .setRequired(false)
          .setMaxLength(30)
          .setPlaceholder("April changelogs");

        const description = new TextInputBuilder()
          .setCustomId("changelogs-description")
          .setLabel("Changelogs description")
          .setStyle(TextInputStyle.Paragraph)
          .setRequired(true)
          .setMaxLength(500)
          .setPlaceholder("Fixed bugs related to the help command");

        const footer = new TextInputBuilder()
          .setCustomId("changelogs-footer")
          .setLabel("Embed footer")
          .setStyle(TextInputStyle.Short)
          .setRequired(false)
          .setMaxLength(20)
          .setPlaceholder("monthly update");

        const color = new TextInputBuilder()
          .setCustomId("changelogs-color")
          .setLabel("Embed color")
          .setStyle(TextInputStyle.Short)
          .setRequired(false)
          .setMaxLength(7)
          .setMinLength(7)
          .setPlaceholder("#ffffff || #000000");

        const type = new TextInputBuilder()
          .setCustomId("changelogs-type")
          .setLabel("Changelogs type")
          .setStyle(TextInputStyle.Short)
          .setRequired(false)
          .setMaxLength(20)
          .setPlaceholder(
            "new commands implemented | bugs fixed | optimization"
          );

        const titleActionRow = new ActionRowBuilder().addComponents(title);
        const descriptionActionRow = new ActionRowBuilder().addComponents(
          description
        );
        const footerActionRow = new ActionRowBuilder().addComponents(footer);
        const colorActionRow = new ActionRowBuilder().addComponents(color);
        const typeActionRow = new ActionRowBuilder().addComponents(type);

        modal.addComponents(
          titleActionRow,
          descriptionActionRow,
          footerActionRow,
          colorActionRow,
          typeActionRow
        );

        await interaction.showModal(modal);
    }
  },
};
