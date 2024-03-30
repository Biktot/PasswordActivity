const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
} = require("discord.js");
const schema = require("../../Schemas/autoresponder");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("autoresponse")
    .setDescription("Add an autoresponse")
    .addSubcommand((command) =>
      command
        .setName("add")
        .setDescription("Add an autoresponse from bot.")
        .addStringOption((opt) =>
          opt
            .setName("trigger")
            .setDescription("What triggers the autoresponse")
            .setRequired(true)
        )
        .addStringOption((opt) =>
          opt
            .setName("response")
            .setDescription("What the bot responds with")
            .setRequired(true)
        )
    )
    .addSubcommand((command) =>
      command
        .setName("remove")
        .setDescription("Removes an autoresponse from bot.")
        .addStringOption((opt) =>
          opt
            .setName("trigger")
            .setDescription("Remove the autoresponse by its trigger")
            .setRequired(true)
        )
    ),
  async execute(interaction, client) {
    const sub = interaction.options.getSubcommand();

    switch (sub) {
      case "add":
        const trigger = interaction.options.getString("trigger");
        const response = interaction.options.getString("response");

        const data = await schema.findOne({ guildId: interaction.guild.id });
        if (!data) {
          await schema.create({
            guildId: interaction.guild.id,
            autoresponses: [
              {
                trigger: trigger,
                response: response,
              },
            ],
          });

          const embed = new EmbedBuilder()
            .setColor(client.config.embed)
            .setTitle("Autoresponse created")
            .setDescription(
              `**Trigger:**\n${trigger}\n\n**Response:**\n${response}`
            );

          await interaction.reply({ embeds: [embed] });
        } else {
          const autoresponders = data.autoresponses;
          for (const t of autoresponders) {
            if (t.trigger === trigger)
              return await interaction.reply({
                content: "You must have unique triggers!",
                ephemeral: true,
              });
          }
          const addto = {
            trigger: trigger,
            response: response,
          };
          await schema.findOneAndUpdate(
            { guildId: interaction.guild.id },
            { $push: { autoresponses: addto } }
          );

          const embed = new EmbedBuilder()
            .setColor(client.config.embed)
            .setTitle("Autoresponse created")
            .setDescription(
              `**Trigger:**\n${trigger}\n\n**Response:**\n${response}`
            );

          await interaction.reply({ embeds: [embed] });
        }
    }

    switch (sub) {
      case "remove":
        const data = await schema.findOne({
          guildId: interaction.guild.id,
          "autoresponses.trigger": interaction.options.getString("trigger"),
        });
        if (!data) {
          const embed = new EmbedBuilder()
            .setColor(client.config.embed)
            .setDescription(
              "I couldn't find an autoresponse with that trigger"
            );
          await interaction.reply({ embeds: [embed] });
        } else {
          await schema.findOneAndDelete({ guildId: interaction.guild.id });
          const embed = new EmbedBuilder()
            .setColor(client.config.embed)
            .setDescription(
              `Deleted that autoresponse!\n\n**Trigger:**\n${interaction.options.getString(
                "trigger"
              )}`
            );
          await interaction.reply({ embeds: [embed] });
        }
    }
  },
};
