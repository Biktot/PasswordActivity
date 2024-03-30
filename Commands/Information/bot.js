const {
  SlashCommandBuilder,
  CommandInteraction,
  PermissionFlagsBits,
  EmbedBuilder,
  ChatInputCommandInteraction,
  Client,
  ChannelType,
  UserFlags,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  version,
} = require("discord.js");
const { mongoose, connection } = require("mongoose");
mongoose.set("strictQuery", true);
mongoose.connect(process.env.mongodb, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const Test = mongoose.model("Test", { name: String });
const os = require("os");
const changelogs = require("../../Schemas/changelogs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName(`bot`)
    .setDescription(`Jarvis OP`)
    .addSubcommand((command) =>
      command
        .setName(`suggest`)
        .setDescription(`Suggest for a feature the bot should have`)
        .addStringOption((option) =>
          option
            .setName("suggestion")
            .setDescription("The suggestion")
            .setRequired(true)
        )
    )
    .addSubcommand((command) =>
      command.setName(`info`).setDescription(`Shows the status of the bot.`)
    )
    .addSubcommand((command) =>
      command.setName(`support`).setDescription(`Get support server invite.`)
    )
    .addSubcommand((command) =>
      command
        .setName(`uptime`)
        .setDescription(`Displays the bot uptime and system uptime`)
    )
    .addSubcommand((command) =>
      command.setName(`invite`).setDescription(`Invite our Bot to your servers`)
    )
    .addSubcommand((command) =>
      command
        .setName(`ping`)
        .setDescription(`Pong! View the speed of the bot's response`)
    )
    .addSubcommand((command) =>
      command.setName(`changelogs`).setDescription(`Show last bot changelogs`)
    )
    .addSubcommand((command) =>
      command
        .setName(`report-bug`)
        .setDescription(`report a bug to the Developers of this Bot!`)
        .addStringOption((option) =>
          option
            .setName("command")
            .setDescription("The not-working/bugging command")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("details")
            .setDescription(
              "Describe the Problem (not required, you can leave that blank ) :)"
            )
            .setRequired(false)
        )
    )
    .addSubcommand((command) =>
      command
        .setName(`feedback`)
        .setDescription(`Give a feedback to my developer.`)
        .addStringOption((option) =>
          option
            .setName("message")
            .setDescription("Your feedback message")
            .setRequired(true)
        )
    ),
  async execute(interaction, client) {
    const sub = interaction.options.getSubcommand();

    // Support
    switch (sub) {
      case "support":
        await interaction.reply({ content: `https://discord.gg/8svMNKA6nY` });
    }

    // Suggest
    switch (sub) {
      case "suggest":
        const suggestion = interaction.options.getString("suggestion");
        const userx = interaction.user.id;

        const embed = new EmbedBuilder()
          .setTitle("NEW SUGGESTION!")
          .setColor("Green")
          .addFields({ name: "User: ", value: `<@${userx}>`, inline: false })
          .setDescription(`${suggestion}`)
          .setTimestamp();

        const xEmbed = new EmbedBuilder()
          .setTitle("You send us a suggestion!")
          .setDescription(`${suggestion}`)
          .setColor("Green");

        const channel = client.channels.cache.get("1102134261936558080");

        channel
          .send({
            embeds: [embed],
          })
          .catch((err) => {
            return;
          });

        return interaction
          .reply({ embeds: [xEmbed], ephemeral: true })
          .catch((err) => {
            return;
          });
    }

    // Ping
    switch (sub) {
      case "ping":
        const icon = interaction.user.displayAvatarURL();
        const tag = interaction.user.tag;
        // Get Mongoose ping
        const dbPingStart = Date.now();
        await Test.findOne();
        const dbPing = Date.now() - dbPingStart;

        const embed = new EmbedBuilder()
          .setTitle("<:uo_ping_pong:1015551332414930994> **PONG!**")
          .setDescription(
            `<a:ping:946754161389748254> | **Latency:** \`${client.ws.ping}ms\`\n<:data:944588615403597824> | **Database Latency:** \`${dbPing}ms\``
          )
          .setColor(client.config.embed)
          .setFooter({ text: `Requested by ${tag}`, iconURL: icon })
          .setTimestamp();

        const btn = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("btn")
            .setStyle(ButtonStyle.Secondary)
            .setLabel(`Reload`)
            .setEmoji("<a:loading:1088346989160321044>")
        );

        const msg = await interaction.reply({
          embeds: [embed],
          components: [btn],
        });

        const collector = msg.createMessageComponentCollector();
        collector.on("collect", async (i) => {
          if (i.customId == "btn") {
            i.update({
              content: `Refreshed The Ping Stats`,
              embeds: [
                new EmbedBuilder()
                  .setTitle("<:uo_ping_pong:1015551332414930994> **PONG!**")
                  .setDescription(
                    `<a:ping:946754161389748254> | **Latency:** \`${client.ws.ping}ms\`\n<:data:944588615403597824> | **Database Latency:** \`${dbPing}ms\``
                  )
                  .setColor(client.config.embed)
                  .setFooter({ text: `Requested by ${tag}`, iconURL: icon })
                  .setTimestamp(),
              ],
              components: [btn],
            });
          }
        });
    }

    // Changelogs
    switch (sub) {
      case "changelogs":
        changelogs
          .findOne({})
          .sort({ date: -1 })
          .exec(async (err, data) => {
            if (err) throw err;
            if (!data)
              interaction.reply({
                content: `> |\`❌\` No changelogs have been published`,
                ephemeral: true,
              });
            if (data) {
              const embed = new EmbedBuilder()
                .setTitle(
                  !data.config.title
                    ? `${client.user.username} Changelogs`
                    : data.config.title
                )
                .setDescription(
                  !data.config.description
                    ? "A new changelogs is here!"
                    : data.config.description
                )
                .setFooter({
                  text: `${
                    !data.config.footer
                      ? `${client.user.username} Changelogs`
                      : `${data.config.footer}`
                  } ${!data.config.type ? `| Bot` : `| ${data.config.type}`}`,
                  iconURL: client.user.avatarURL(),
                })
                .setColor(!data.config.color ? "White" : data.config.color);

              interaction.reply({ embeds: [embed], ephemeral: true });
            }
          });
    }

    // Invite
    switch (sub) {
      case "invite":
        const link = `https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=303600576574&scope=bot%20applications.commands`;
        const buttons = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setURL(link)
            .setLabel("Invite Me")
            .setStyle(ButtonStyle.Link)
        );
        const invite = new EmbedBuilder()
          .setAuthor({ name: `${client.user.tag}` })
          .setDescription(`*Click on the button below to invite me*`)
          .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
          .setColor(client.config.embed);

        interaction.reply({
          embeds: [invite],
          components: [buttons],
          ephemeral: false,
        });
    }

    // Uptime
    switch (sub) {
      case "uptime":
        const { formatTime } = require("../../Handlers/time");
        // Calculate the bot's uptime
        const botUptime = process.uptime();
        const formattedBotUptime = formatTime(botUptime);

        // Calculate the system's uptime
        const systemUptime = os.uptime();
        const formattedSystemUptime = formatTime(systemUptime);

        // Reply with the uptime information
        await interaction.reply({
          content: `## Bot uptime: ${formattedBotUptime}\n## System uptime: ${formattedSystemUptime}`,
        });
    }
    // Bug-Report
    switch (sub) {
      case "report-bug":
        const USER = interaction.user.tag;
        const Command = interaction.options.getString("command");
        const BUG =
          interaction.options.getString("details") || "No details given!";

        const embed = new EmbedBuilder()
          .setTitle("NEW REPORTED BUG!")
          .setDescription(`Bug: ${BUG}`)
          .addFields({ name: "Command", value: `${Command}`, inline: false })
          .addFields({ name: `user`, value: `${USER}`, inline: false });

        const sendEmbed = new EmbedBuilder()
          .setTitle("YOU REPORTED A BUG!")
          .setDescription(`Bug: ${BUG}`)
          .addFields({ name: "Command", value: `${Command}` })
          .setFooter({
            text: "The Developer Team will contact you as fast as they can!",
          });

        const channel = client.channels.cache.get(client.config.bugreport);

        channel
          .send({
            embeds: [embed],
          })
          .catch((err) => {
            return;
          });

        return interaction
          .reply({ embeds: [sendEmbed], ephemeral: true })
          .catch((err) => {
            return;
          });
    }

    // Bot-info
    switch (sub) {
      case "info":
        const { formatTime } = require("../../Handlers/time");
        // Calculate the bot's uptime
        const botUptime = process.uptime();
        const formattedBotUptime = formatTime(botUptime);

        // Calculate the system's uptime
        const systemUptime = os.uptime();
        const formattedSystemUptime = formatTime(systemUptime);
        const status = [
          "Disconnected",
          "Connected",
          "Connecting",
          "Disconnecting",
        ];

        await client.user.fetch();
        await client.application.fetch();

        const getChannelTypeSize = (type) =>
          client.channels.cache.filter((channel) => type.includes(channel.type))
            .size;

        // Buttons

        const button = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setURL(
              `https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=303600576574&scope=bot%20applications.commands`
            )
            .setLabel(`Invite Me`)
            .setStyle(ButtonStyle.Link),

          new ButtonBuilder()
            .setURL(`https://discord.gg/7BfRV7w6ha`)
            .setLabel(`Support Server`)
            .setStyle(ButtonStyle.Link),

          new ButtonBuilder()
            .setURL(`https://bit.ly/3JYAkkq`)
            .setLabel(`Website`)
            .setStyle(ButtonStyle.Link),

          new ButtonBuilder()
            .setURL(`https://top.gg/bot/1002188910560026634/vote`)
            .setLabel(`Vote`)
            .setStyle(ButtonStyle.Link)
        );

        interaction.reply({
          embeds: [
            new EmbedBuilder()

              .setColor(client.config.embed)
              .setTitle(`${client.user.username}`)
              .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
              .addFields({
                name: `**Basic Information**`,
                value: `>>> **Client ID:** \`[${
                  client.user.id
                }]\`\n**Server Count:** ${
                  client.guilds.cache.size
                }\n**User Count:** ${client.guilds.cache.reduce(
                  (acc, guild) => acc + guild.memberCount,
                  0
                )}\n**Channel Count:** ${getChannelTypeSize([
                  ChannelType.GuildText,
                  ChannelType.GuildNews,
                ])}\n**Total Commands:** ${
                  client.commands.size
                }\n**Developer:** <@${client.application.owner.id}>`,
                inline: false,
              })
              .addFields({
                name: `**Status**`,
                value: `>>> **Ping:** ${
                  client.ws.ping
                }ms\n**Uptime:** ${formattedBotUptime}\n**OS:** ${os
                  .type()
                  .replace(`\`Windows_NT\``, `\`Windows\``)
                  .replace(`\`Darwin\``, `\`macOS\``)}\n**CPU Usage:** ${(
                  process.memoryUsage().heapUsed /
                  1024 /
                  1024
                ).toFixed(2)}%\n**CPU Model:** ${os.cpus()[0].model}`,
                inline: false,
              }),
          ],
          components: [button],
          ephemeral: false,
        });
    }
    // Feedback
    switch (sub) {
      case "feedback":
        const USER = interaction.user.tag;
        const Command = interaction.options.getString("message");

        const embed = new EmbedBuilder()
          .setTitle("NEW Feedback")
          .addFields({ name: "Feedback", value: `${Command}`, inline: false })
          .addFields({ name: `user`, value: `${USER}`, inline: false });

        const sendEmbed = new EmbedBuilder()
          .setTitle("Thanks For Your Feedback")
          .addFields({ name: "Feedback", value: `${Command}` })
          .setFooter({
            text: "The Developer Team Recived Your Feedback",
          });

        const channel = client.channels.cache.get(client.config.feedback);

        channel
          .send({
            embeds: [embed],
          })
          .catch((err) => {
            return;
          });

        return interaction
          .reply({ embeds: [sendEmbed], ephemeral: true })
          .catch((err) => {
            return;
          });
    }
  },
};
