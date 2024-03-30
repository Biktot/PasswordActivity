const {
    ChatInputCommandInteraction,
    EmbedBuilder,
    ChannelType,
    GuildVerificationLevel,
    GuildExplicitContentFilter,
    GuildNSFWLevel,
    SlashCommandBuilder,
  } = require("discord.js");
  
  module.exports = {
    data: new SlashCommandBuilder()
      .setName("serverinfo")
      .setDescription("Displays information about the server."),
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
      const { guild } = interaction;
      const { members, channels, emojis, roles, stickers } = guild;
  
      const sortedRoles = roles.cache
        .map((role) => role)
        .slice(1, roles.cache.size)
        .sort((a, b) => b.position - a.position);
      const userRoles = sortedRoles.filter((role) => !role.managed);
      const managedRoles = sortedRoles.filter((role) => role.managed);
      const botCount = members.cache.filter((member) => member.user.bot).size;
  
      const maxDisplayRoles = (roles, maxFieldLength = 1024) => {
        let totalLength = 0;
        const result = [];
  
        for (const role of roles) {
          const roleString = `<@&${role.id}>`;
  
          if (roleString.length + totalLength > maxFieldLength) break;
  
          totalLength += roleString.length + 1; // +1 as it's likely we want to display them with a space between each role, which counts towards the limit.
          result.push(roleString);
        }
  
        return result.length;
      };
  
      const splitPascal = (string, separator) =>
        string.split(/(?=[A-Z])/).join(separator);
      const toPascalCase = (string, separator = false) => {
        const pascal =
          string.charAt(0).toUpperCase() +
          string
            .slice(1)
            .toLowerCase()
            .replace(/[^a-zA-Z0-9]+(.)/g, (match, chr) => chr.toUpperCase());
        return separator ? splitPascal(pascal, separator) : pascal;
      };
  
      const getChannelTypeSize = (type) =>
        channels.cache.filter((channel) => type.includes(channel.type)).size;
  
      const totalChannels = getChannelTypeSize([
        ChannelType.GuildText,
        ChannelType.GuildNews,
        ChannelType.GuildVoice,
        ChannelType.GuildStageVoice,
        ChannelType.GuildForum,
        ChannelType.GuildPublicThread,
        ChannelType.GuildPrivateThread,
        ChannelType.GuildNewsThread,
        ChannelType.GuildCategory,
      ]);
  
      interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(members.me.roles.highest.hexColor)
            .setTitle(`${guild.name}'s Information`)
            .setThumbnail(guild.iconURL({ size: 1024 }))
            .setImage(guild.bannerURL({ size: 1024 }))
            .addFields(
              { name: "Description", value: `📝 ${guild.description || "None"}` },
              {
                name: "General",
                value: [
                  `<:icons_createchannels:1087662668267139102> **Created** <t:${parseInt(
                    guild.createdTimestamp / 1000
                  )}:R>`,
                  `<:icons_id:1087708723255980032> **ID** \`${guild.id}\``,
                  `<a:crown_uo:992411806033264742> **Owner** <@${guild.ownerId}>`,
                  `<:Language:1094210402012909670> **Language** \`${new Intl.DisplayNames(
                    ["en"],
                    {
                      type: "language",
                    }
                  ).of(guild.preferredLocale)}\``,
                  `<:link:944477961782956042> **Vanity URL** ${
                    guild.vanityURLCode || "None"
                  }`,
                ].join("\n"),
              },
              {
                name: "Features",
                value:
                  guild.features
                    ?.map((feature) => `- ${toPascalCase(feature, " ")}`)
                    ?.join("\n") || "None",
                inline: true,
              },
              {
                name: "Security",
                value: [
                  `<:filter:943794210715365376> **Explicit Filter** \`${splitPascal(
                    GuildExplicitContentFilter[guild.explicitContentFilter],
                    " "
                  )}\``,
                  `<:nsfw:992412474806640701> **NSFW Level** \`${splitPascal(
                    GuildNSFWLevel[guild.nsfwLevel],
                    " "
                  )}\``,
                  `<:lock:945585739339542538> **Verification Level** \`${splitPascal(
                    GuildVerificationLevel[guild.verificationLevel],
                    " "
                  )}\``,
                ].join("\n"),
                inline: true,
              },
              {
                name: `Users (\`${guild.memberCount}\`)`,
                value: [
                  `<:Members:945590169111756830> **Members** \`${
                    guild.memberCount - botCount
                  }\``,
                  `<a:bot:1089179588883660910> **Bots** \`${botCount}\``,
                ].join("\n"),
                inline: true,
              },
              {
                name: `User Roles (${maxDisplayRoles(userRoles)} of ${
                  userRoles.length
                })`,
                value: `${
                  userRoles.slice(0, maxDisplayRoles(userRoles)).join(" ") ||
                  "None"
                }`,
              },
              {
                name: `Managed Roles (${maxDisplayRoles(managedRoles)} of ${
                  managedRoles.length
                })`,
                value: `${
                  managedRoles
                    .slice(0, maxDisplayRoles(managedRoles))
                    .join(" ") || "None"
                }`,
              },
              {
                name: `Channels, Threads & Categories (${totalChannels})`,
                value: [
                  `<:icon_text:1087665546247557140> **Text** \`${getChannelTypeSize(
                    [
                      ChannelType.GuildText,
                      ChannelType.GuildForum,
                      ChannelType.GuildNews,
                    ]
                  )}\``,
                  `<:voice:992409545446019082> **Voice** \`${getChannelTypeSize([
                    ChannelType.GuildVoice,
                    ChannelType.GuildStageVoice,
                  ])}\``,
                  `<:Threads:1087665746789806131> **Threads** \`${getChannelTypeSize(
                    [
                      ChannelType.GuildPublicThread,
                      ChannelType.GuildPrivateThread,
                      ChannelType.GuildNewsThread,
                    ]
                  )}\``,
                  `<:categories:1079993999655452702> **Categories** \`${getChannelTypeSize(
                    [ChannelType.GuildCategory]
                  )}\``,
                ].join("\n"),
                inline: true,
              },
              {
                name: `Emojis & Stickers (${
                  emojis.cache.size + stickers.cache.size
                })`,
                value: [
                  `<a:animate:1094211480137769010> **Animated** ${
                    emojis.cache.filter((emoji) => emoji.animated).size
                  }`,
                  `<:statistics:1077948408402296942> **Static** ${
                    emojis.cache.filter((emoji) => !emoji.animated).size
                  }`,
                  `<:stickers:1094211705757765733> **Stickers** ${stickers.cache.size}`,
                ].join("\n"),
                inline: true,
              },
              {
                name: "Nitro",
                value: [
                  `<:ServerBoostTier3:1094211926818570292> **Tier** ${
                    guild.premiumTier || "None"
                  }`,
                  `<a:Server_Boosts:1094212026361978931> **Boosts** ${guild.premiumSubscriptionCount}`,
                  `<a:ex_booster:1006210639158579371> **Boosters** ${
                    guild.members.cache.filter(
                      (member) => member.roles.premiumSubscriberRole
                    ).size
                  }`,
                  `<:booste:1094212295900528670> **Total Boosters** ${
                    guild.members.cache.filter((member) => member.premiumSince)
                      .size
                  }`,
                ].join("\n"),
                inline: true,
              },
              { name: "Banner", value: guild.bannerURL() ? "** **" : "None" }
            ),
        ],
        ephemeral: false,
      });
    },
  };
  