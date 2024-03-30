const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const { Code } = require("../../Schemas/codeSchema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName(`premium`)
    .setDescription(`subcommands for premium`)
    .addSubcommand((command) =>
      command
        .setName(`generate`)
        .setDescription(`Generate a premium code`)
        .addStringOption((option) =>
          option
            .setName("length")
            .setDescription("The length of time the code should be valid for")
            .setRequired(true)
            .addChoices(
              {
                name: "1 day",
                value: "daily",
              },
              {
                name: "7 days",
                value: "weekly",
              },
              {
                name: "30 days",
                value: "monthly",
              },
              {
                name: "365 days",
                value: "yearly",
              }
            )
        )
    )
    .addSubcommand((command) =>
      command
        .setName(`redeem`)
        .setDescription(`Redeem a premium code`)
        .addStringOption((option) =>
          option
            .setName("code")
            .setDescription("The premium code to redeem")
            .setRequired(true)
        )
    )
    .addSubcommand((command) =>
      command
        .setName(`delete`)
        .setDescription(`Delete a premium code`)
        .addStringOption((option) =>
          option
            .setName("code")
            .setDescription("The premium code to delete")
            .setRequired(true)
        )
    )
    .addSubcommand((command) =>
      command.setName(`users`).setDescription(`View all premium users list.`)
    )
    .addSubcommand((command) =>
      command
        .setName(`edit-expiry`)
        .setDescription(`Edit the expiry of a premium code`)
        .addStringOption((option) =>
          option
            .setName("code")
            .setDescription("The code to edit")
            .setRequired(true)
        )
        .addIntegerOption((option) =>
          option
            .setName("days")
            .setDescription("The number of days to add to the expiry date")
            .setRequired(true)
            .addChoices(
              { name: "1 day", value: 1 },
              { name: "3 days", value: 3 },
              { name: "7 days", value: 7 },
              { name: "14 days", value: 14 },
              { name: "30 days", value: 30 },
              { name: "60 days", value: 60 }
            )
        )
    )
    .addSubcommand((command) =>
      command
        .setName(`status`)
        .setDescription(`Check if a user is a premium user`)
    ),
  async execute(interaction, client) {
    const sub = interaction.options.getSubcommand();

    switch (sub) {
      case "generate":
        const codeLength = interaction.options.getString("length");
        const validLengths = ["daily", "weekly", "monthly", "yearly"];
        const codeType = validLengths.includes(codeLength)
          ? codeLength
          : "daily";

        const code = Math.random().toString(36).substring(2, 8);
        const newCode = new Code({
          code,
          length: codeType,
        });

        if (interaction.user.id === `${client.config.developerid}`) {
          try {
            await newCode.save();
            const embed = new EmbedBuilder()
              .setTitle("Code Generated")
              .setDescription("Your code has been successfully generated.")
              .addFields(
                { name: "Code", value: `${code}`, inline: true },
                { name: "Length", value: `${codeType}`, inline: true }
              )
              .setColor("Green")
              .setTimestamp();
            await interaction.reply({ embeds: [embed], ephemeral: true });
          } catch (error) {
            console.error(error);
            const embed = new EmbedBuilder()
              .setTitle("Code Generation Failed")
              .setDescription(
                "An error occurred while generating the code. Please try again later."
              )
              .setColor("Red");
            await interaction.reply({ embeds: [embed], ephemeral: true });
          }
        } else {
          return interaction.reply({
            content: `Only **the owner** of ${client.user} can use this command.`,
            ephemeral: true,
          });
        }
    }

    switch (sub) {
      case "redeem":
        const userId = interaction.user.id;

        const codeValue = interaction.options.getString("code");

        try {
          const code = await Code.findOne({ code: codeValue });

          if (!code) {
            const embed = new EmbedBuilder()
              .setColor("Red")
              .setTitle("Code Redemption Failed")
              .setDescription(
                "The code you entered is invalid. Please try again."
              );
            await interaction.reply({ embeds: [embed], ephemeral: true });
            return;
          }

          if (code.redeemedBy && code.redeemedBy.id) {
            const embed = new EmbedBuilder()
              .setColor("Red")
              .setTitle("Code Redemption Failed")
              .setDescription(
                "The code you entered has already been redeemed."
              );
            await interaction.reply({ embeds: [embed], ephemeral: true });
            return;
          }

          const existingCode = await Code.findOne({
            "redeemedBy.id": userId,
          });
          if (existingCode) {
            const embed = new EmbedBuilder()
              .setColor("Red")
              .setTitle("Code Redemption Failed")
              .setDescription(
                "You have already redeemed a code. You cannot redeem another one."
              );
            await interaction.reply({ embeds: [embed], ephemeral: true });
            return;
          }

          const codeExpiration = new Date();
          const codeLength = code.length;
          const expirationLengths = {
            daily: 1,
            weekly: 7,
            monthly: 30,
            yearly: 365,
            "14 days": 14,
            "30 days": 30,
            "60 days": 60,
            "90 days": 90,
          };

          const expirationLength =
            expirationLengths[codeLength] || parseInt(codeLength);
          if (isNaN(expirationLength)) {
            const embed = new EmbedBuilder()
              .setColor("Red")
              .setTitle("Code Redemption Failed")
              .setDescription("The code you entered has an invalid length.");
            await interaction.reply({ embeds: [embed], ephemeral: true });
            return;
          }
          codeExpiration.setDate(codeExpiration.getDate() + expirationLength);

          const redeemedUser = {
            id: interaction.user.id,
            username: interaction.user.username,
          };

          const redeemedOn = new Date();

          await Code.updateOne(
            { code: codeValue },
            {
              $set: {
                redeemedBy: redeemedUser,
                redeemedOn: redeemedOn,
                expiresAt: codeExpiration,
              },
            }
          );
          const embed = new EmbedBuilder()
            .setColor("Green")
            .setTitle("Code Redeemed")
            .setDescription("You have successfully redeemed the code.")
            .addFields(
              { name: "Code", value: `${codeValue}`, inline: true },
              { name: "Length", value: `${codeLength}`, inline: true },
              {
                name: "Expires In:",
                value: `<t:${Math.floor(codeExpiration.getTime() / 1000)}:R>`,
                inline: true,
              }
            )
            .setTimestamp();
          await interaction.reply({ embeds: [embed], ephemeral: true });
        } catch (error) {
          console.error(error);
          const embed = new EmbedBuilder()
            .setTitle("Code Redemption Failed")
            .setDescription(
              "An error occurred while redeeming the code. Please try again later."
            )
            .setColor("Red");
          await interaction.reply({ embeds: [embed], ephemeral: true });
        }
    }

    switch (sub) {
      case "delete":
        const ERROR_MESSAGES = {
          CODE_NOT_FOUND: "The code you entered is invalid. Please try again.",
          CODE_ALREADY_REDEEMED:
            "The code you entered has already been redeemed.",
          EXPIRATION_DATE_NOT_FOUND:
            "The code you entered has already been redeemed, but there was an issue retrieving the expiration date.",
        };
        if (interaction.user.id === `${client.config.developerid}`) {
          try {
            const codeValue = interaction.options.getString("code");

            const code = await Code.findOne({ code: codeValue });

            if (!code) {
              const embed = new EmbedBuilder()
                .setTitle("Code Deletion Failed")
                .setDescription(ERROR_MESSAGES.CODE_NOT_FOUND)
                .setColor("Red");
              await interaction.reply({ embeds: [embed], ephemeral: true });
              return;
            }

            if (
              code.redeemedBy &&
              code.redeemedBy.username &&
              code.redeemedBy.id
            ) {
              const confirmEmbed = new EmbedBuilder()
                .setTitle("Code Deletion Confirmation")
                .setDescription(
                  `Are you sure you want to delete code "${codeValue}"?\n\nType \`!delete ${codeValue}\` to confirm.`
                )
                .setColor("Orange");
              const message = await interaction.reply({
                embeds: [confirmEmbed],
                ephemeral: true,
              });

              const filter = (msg) =>
                msg.author.id === interaction.user.id &&
                msg.content.toLowerCase() === `!delete ${codeValue}`;

              const collector = interaction.channel.createMessageCollector({
                filter,
                time: 10000, // 10 seconds
              });

              collector.on("collect", async (msg) => {
                await msg.delete();
                await Code.deleteOne({ _id: code._id });

                const embed = new EmbedBuilder()
                  .setTitle("Code Deleted")
                  .setDescription("The code has been successfully deleted.")
                  .setColor("Green");
                await interaction.editReply({ embeds: [embed] });
              });

              collector.on("end", async (collected) => {
                if (collected.size === 0) {
                  const timeoutEmbed = new EmbedBuilder()
                    .setTitle("Code Deletion Failed")
                    .setDescription(
                      "The confirmation timed out. Please try again by running the command again."
                    )
                    .setColor("Red");
                  await interaction.editReply({ embeds: [timeoutEmbed] });
                }
              });

              return;
            }

            await Code.deleteOne({ _id: code._id });

            const embed = new EmbedBuilder()
              .setTitle("Code Deleted")
              .setDescription("The code has been successfully deleted.")
              .setColor("Green");
            await interaction.reply({ embeds: [embed], ephemeral: true });
          } catch (error) {
            console.error(error);
            const embed = new EmbedBuilder()
              .setTitle("Command Execution Failed")
              .setDescription(
                "An error occurred while executing this command. Please try again later."
              )
              .setColor("Red");
            await interaction.reply({ embeds: [embed], ephemeral: true });
          }
        } else {
          return interaction.reply({
            content: `Only **the owner** of ${client.user} can use this command.`,
            ephemeral: true,
          });
        }
    }

    switch (sub) {
      case "users":
        const codes = await Code.find({ "redeemedBy.id": { $ne: null } });
        const users = codes.map((code) => code.redeemedBy);

        const embed = new EmbedBuilder()
          .setColor("#0099ff")
          .setTitle("Premium Codes")
          .setDescription("List of users who have redeemed a premium code:")
          .addFields(
            users.map((user) => {
              return {
                name: user.username,
                value: `<@${user.id}>`,
                inline: true,
              };
            })
          )
          .setFooter({ text: "Premium Codes" });

        interaction.reply({ embeds: [embed], ephemeral: true });
    }

    switch (sub) {
      case "edit-expiry":
        const ERROR_MESSAGES = {
          CODE_NOT_FOUND: "The code you entered is invalid. Please try again.",
          EXPIRY_EDIT_FAILED:
            "The expiry date of the code could not be updated. Please try again later.",
        };

        const codeValue = interaction.options.getString("code");
        const daysToAdd = interaction.options.getInteger("days");

        if (interaction.user.id === `${client.config.developerid}`) {
          try {
            const code = await Code.findOne({ code: codeValue });
            if (!code) {
              const embed = new EmbedBuilder()
                .setTitle("Edit Expiry Failed")
                .setDescription(ERROR_MESSAGES.CODE_NOT_FOUND)
                .setColor("Red");
              await interaction.reply({ embeds: [embed], ephemeral: true });
              return;
            }

            let newExpiry;
            if (code.redeemedBy && code.redeemedBy.id) {
              newExpiry = new Date(
                code.expiresAt.getTime() + daysToAdd * 86400000
              );

              await Code.updateOne(
                { code: codeValue },
                { $set: { expiresAt: newExpiry } }
              );
            } else {
              const length = Object.keys(code)[0];

              await Code.updateOne(
                { code: codeValue },
                { $set: { length: `${daysToAdd} days` } }
              );
            }

            const embed = new EmbedBuilder()
              .setTitle("Expiry Edited")
              .setDescription(
                "The expiry date of the code has been successfully edited."
              )
              .addFields({ name: "Code", value: `${code.code}`, inline: true });

            if (newExpiry) {
              embed.addFields({
                name: "New Expiry",
                value: `<t:${Math.floor(newExpiry.getTime() / 1000)}:R>`,
                inline: true,
              });
            } else {
              embed.addFields({
                name: "New Length",
                value: `${daysToAdd} days`,
                inline: true,
              });
            }

            embed.setTimestamp().setColor("Green");

            await interaction.reply({ embeds: [embed], ephemeral: true });
          } catch (err) {
            console.error(err);
            const embed = new EmbedBuilder()
              .setTitle("Edit Expiry Failed")
              .setDescription(ERROR_MESSAGES.EXPIRY_EDIT_FAILED)
              .setColor("Red");
            await interaction.reply({ embeds: [embed], ephemeral: true });
          }
        } else {
          return interaction.reply({
            content: `Only **the owner** of ${client.user} can use this command.`,
            ephemeral: true,
          });
        }
    }

    switch (sub) {
      case "status":
        const MESSAGES = {
          USER_NOT_PREMIUM: "The user is not currently a premium user.",
        };

        const targetUserId =
          interaction.options.getUser("user")?.id || interaction.user.id;

        const code = await Code.findOne({ "redeemedBy.id": targetUserId });
        if (!code) {
          const embed = new EmbedBuilder()
            .setTitle("User Not Premium")
            .setDescription(MESSAGES.USER_NOT_PREMIUM)
            .setColor("Red");
          await interaction.reply({ embeds: [embed], ephemeral: true });
          return;
        }

        const activatedOn = `<t:${Math.floor(
          code.redeemedOn.getTime() / 1000
        )}:R>`;
        const expiresAt = `<t:${Math.floor(
          code.expiresAt.getTime() / 1000
        )}:R>`;
        const embed = new EmbedBuilder()
          .setTitle("User Premium Status")
          .setDescription(
            `The user <@${targetUserId}> is currently a premium user.`
          )
          .addFields(
            { name: "Code", value: code.code, inline: true },
            { name: "Activated On", value: activatedOn, inline: true },
            { name: "Expires At", value: expiresAt, inline: true }
          )
          .setColor("Green")
          .setTimestamp();
        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
  },
};
