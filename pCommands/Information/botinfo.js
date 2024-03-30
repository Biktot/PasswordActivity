const {
    EmbedBuilder,
    Client,
    ChannelType,
    UserFlags,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder,
    version,
  } = require("discord.js");
const os = require("os");
module.exports = {
  name: "botinfo",
  aliases: ["stats", "status"],
  args: false,
  owner: false,

  async execute(message, client, args) {

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

        message.reply({
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
  },
};
