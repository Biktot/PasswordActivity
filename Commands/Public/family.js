const {
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} = require("discord.js");
const marriageSchema = require('../../Schemas/marriageSchema');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("family")
    .setDescription("Family Commands Lol Doesn't Makes Sense xD")
    .addSubcommand((command) =>
      command
        .setName("marry")
        .setDescription("Marry somebody")
        .addUserOption((opt) =>
          opt
            .setName("person")
            .setDescription("The person you want to marry")
            .setRequired(true)
        )
    )
    .addSubcommand((command) =>
      command.setName("divorce").setDescription("Divorce your partner")
    )
    .addSubcommand((command) =>
      command
        .setName("relationships")
        .setDescription(
          "See who a user is married to, if they're married at all"
        )
        .addUserOption((opt) =>
          opt
            .setName("user")
            .setDescription("User you're checking")
            .setRequired(false)
        )
    ),
  async execute(interaction, client) {
    const sub = interaction.options.getSubcommand();

    switch (sub) {
      case "marry":
        const schema = require('../../Schemas/marriageSchema');
        const user = interaction.options.getUser("person");
        if (user.bot)
          return await interaction.reply({
            content: "You cannot marry a bot?! weirdo!",
            ephemeral: true,
          });
        if (interaction.user.id === user.id)
          return await interaction.reply({
            content: "You can't marry yourself! Silly goose!",
            ephemeral: true,
          });
        const intUser = interaction.user;
        const intUserData = await marriageSchema.findOne({
          marriedUser: intUser.id,
        });
        const userData = await marriageSchema.findOne({ marriedUser: user.id });
        if (!intUserData) {
          if (!userData) {
            const embed = new EmbedBuilder()
              .setColor(client.config.embed)
              .setTitle(`Do they accept?`)
              .setDescription(
                `${intUser} Wants to marry you! Do you accept their proposal?`
              );

            const accept = new ButtonBuilder()
              .setCustomId("accept")
              .setLabel("I do")
              .setStyle(ButtonStyle.Success);

            const deny = new ButtonBuilder()
              .setCustomId("no")
              .setLabel("I don't")
              .setStyle(ButtonStyle.Danger);
            const row = new ActionRowBuilder().addComponents(accept, deny);
            const msg = await interaction.reply({
              content: `${user}`,
              allowedMentions: {
                parse: ["users"],
              },
              embeds: [embed],
              components: [row],
              fetchReply: true,
            });
            const collector = msg.createMessageComponentCollector();
            collector.on("collect", async (i) => {
              if (i.user.id !== user.id)
                return await i.reply({
                  content: `Only ${user} can use these buttons!`,
                  ephemeral: true,
                });
              if (i.customId === "accept") {
                embed
                  .setColor("Green")
                  .setTitle("Congratulations! 🎉")
                  .setDescription(
                    `${intUser} and ${user} are officially married!`
                  );

                accept.setDisabled(true);
                deny.setDisabled(true);

                await marriageSchema.create({
                  marriedUser: user.id,
                  marriedTo: intUser.id,
                });
                await marriageSchema.create({
                  marriedUser: intUser.id,
                  marriedTo: user.id,
                });

                await i.deferUpdate();
                await interaction.editReply({
                  embeds: [embed],
                  content: null,
                  components: [row],
                });
              }
              if (i.customId === "no") {
                embed
                  .setColor("Red")
                  .setTitle("😔")
                  .setDescription(`${user} Did not want to marry you!`);

                accept.setDisabled(true);
                deny.setDisabled(true);

                await i.deferUpdate();
                await interaction.editReply({
                  embeds: [embed],
                  content: null,
                  components: [row],
                });
              }
            });
          } else {
            const embed = new EmbedBuilder()
              .setColor("Red")
              .setTitle("This person is already married!");

            await interaction.reply({ embeds: [embed] });
          }
        } else {
          const embed = new EmbedBuilder()
            .setColor("Red")
            .setTitle("You're already married!");

          await interaction.reply({ embeds: [embed] });
        }
    }

    switch (sub) {
      case "divorce":
        const schema = require('../../Schemas/marriageSchema');
        const intUser = interaction.user;
        const userData = await marriageSchema.findOne({
          marriedUser: intUser.id,
        });
        if (!userData) {
          await interaction.reply({
            content: "You aren't married to anybody yet!",
            ephemeral: true,
          });
        } else {
          const marriedToID = userData.marriedTo;
          const embed = new EmbedBuilder()
            .setColor("DarkVividPink")
            .setTitle("Are you sure?")
            .setDescription(
              `${intUser}, are you sure you want to divorce <@${marriedToID}>? You can only re-marry if they accept.`
            );
          const yes = new ButtonBuilder()
            .setCustomId("yes")
            .setLabel("Yes")
            .setStyle(ButtonStyle.Success);
          const no = new ButtonBuilder()
            .setCustomId("no")
            .setLabel("No")
            .setStyle(ButtonStyle.Danger);
          const row = new ActionRowBuilder().addComponents(yes, no);
          const msg = await interaction.reply({
            embeds: [embed],
            components: [row],
          });
          const collector = msg.createMessageComponentCollector();
          collector.on("collect", async (i) => {
            if (!i.isButton()) return;
            if (i.user.id !== interaction.user.id) return await i.deferUpdate();
            if (i.customId === "yes") {
              const embed = new EmbedBuilder()
                .setColor("Green")
                .setTitle("You're single!")
                .setDescription(
                  `You divorced <@${marriedToID}> and now you're single! congratulations!`
                );
              yes.setDisabled(true);
              no.setDisabled(true);

              await marriageSchema.findOneAndDelete({
                marriedUser: marriedToID,
              });
              await marriageSchema.findOneAndDelete({
                marriedUser: interaction.user.id,
              });

              await i.deferUpdate();
              await interaction.editReply({
                embeds: [embed],
                components: [row],
              });
            }

            if (i.customId === "no") {
              const embed = new EmbedBuilder()
                .setColor("Green")
                .setTitle("Your choice 🤷")
                .setDescription(
                  `You decided not to divorce <@${marriedToID}>, nice..?`
                );
              yes.setDisabled(true);
              no.setDisabled(true);

              await i.deferUpdate();
              await interaction.editReply({
                embeds: [embed],
                components: [row],
              });
            }
          });
        }
    }

    switch (sub) {
      case "relationships":
        const schema = require('../../Schemas/marriageSchema');
        const user = interaction.options.getUser("user") || interaction.user;
        const data = await schema.findOne({ marriedUser: user.id });
        if (!data) {
          const embed = new EmbedBuilder()
            .setColor("Red")
            .setDescription(`${user} isn't married to anybody!`);

          await interaction.reply({ embeds: [embed] });
        } else {
          const embed = new EmbedBuilder()
            .setColor("Green")
            .setDescription(`${user} is married to <@${data.marriedTo}>`);

          await interaction.reply({ embeds: [embed] });
        }
    }
  },
};
