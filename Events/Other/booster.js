const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

const boosterSchema = require("../../Schemas/boosterSchema");

module.exports = {
  name: "guildMemberUpdate",
  async execute(oldMember, newMember, client) {
    const boosterdata = await boosterSchema.findOne({ Guild: client.guild.id });

    if (!boosterdata) return;

    const boostAnnounceChannel = client.channels.cache.get(
      boosterdata.Channel1
    );

    const boostAnnouceLogChannel = client.channels.cache.get(
      boosterdata.Channel2
    );

    const format = {
      0: "No Level",
      1: "Level 1",
      2: "Level 2",
      3: "Level 3",
    };

    const boostLevel = format[newMember.guild.premiumTier];

    if (!oldMember.roles.cache.size !== newMember.roles.cache.size) {
      if (
        !oldMember.roles.cache.has(
          newMember.guild.roles.premiumSubscriberRole.id
        ) &&
        newMember.roles.cache.has(
          newMember.guild.roles.premiumSubscriberRole.id
        )
      ) {
        const boostAnnounceEmbed = new EmbedBuilder()
          .setAuthor({
            name: `🎉🎉 BOOSTER PARTY 🎉🎉`,
            iconURL: newMember.guild.iconURL({ size: 1024 }),
          })
          .setDescription(
            `> <@${newMember.user.id}>, You Are Awsome And Amazing.\n\n> Thanks For Boost The Server\n> Enjoy Your ${newMember.guild.roles.premiumSubscriberRole} and Other Exclusive Perks!`
          )
          .addFields({
            name: "> 💎 Total Boost:",
            value: `${newMember.guild.premiumSubscriptionCount} Boost | ${boostLevel}`,
            inline: false,
          })
          .setImage("https://tenor.com/view/discord-banner-boost-gif-22451991")
          .setColor("F47FFF")
          .setFooter({
            text: `${newMember.guild.name} Boost Detection System`,
            iconURL: newMember.user.displayAvatarURL({ size: 1024 }),
          })
          .setTimestamp();
        const boostAnnounceRow = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setLabel(`${newMember.user.tag}`)
            .setCustomId("BoostDetection")
            .setStyle(ButtonStyle.Danger)
            .setDisabled(true)
        );

        const msg = await boostAnnounceChannel.send({
          content: `${newMember} \`<@${newMember.user.id}>\``,
          embeds: [boostAnnounceEmbed],
          components: [boostAnnounceRow],
        });
        msg.react("🎉");

        //Send DM to NEW Nitro Booster
        newMember.send({
          content: `Hello ${newMember.user.tag} You are Awesome, Thanks For Boost The **__${newMember.guild.name}__** Server\nSo Enjoy Your **${newMember.guild.roles.premiumSubscriberRole.name}** Role And Other Massive Perks🎉`,
          components: [boostAnnounceRow],
        });

        //Boost Announce Log System
        const boostLogEmbed = new EmbedBuilder()
          .setAuthor({
            name: `NEW Boost Detection System`,
            iconURL: client.user.displayAvatarURL(),
          })
          .addFields(
            {
              name: "💎 Nitro Booster",
              value: `${newMember.user} | ${newMember.user.tag}`,
            },
            {
              name: "🎉 Server Boost at:",
              value: `<t:${Math.round(
                newMember.premiumSinceTimestamp / 1000
              )}:f> | <t:${Math.round(
                newMember.premiumSinceTimestamp / 1000
              )}:R>`,
              inline: true,
            },
            {
              name: "⏰ Account Created at:",
              value: `<t:${Math.round(
                newMember.user.createdTimestamp / 1000
              )}:f> | <t:${Math.round(
                newMember.user.createdTimestamp / 1000
              )}:R>`,
              inline: true,
            },
            {
              name: "📆 Joined Server at:",
              value: `<t:${Math.round(
                newMember.joinedTimestamp / 1000
              )}:f> | <t:${Math.round(newMember.joinedTimestamp / 1000)}:R>`,
              inline: true,
            },
            {
              name: "💜 Total Boost",
              value: `${newMember.guild.premiumSubscriptionCount} Boost | ${boostLevel}`,
              inline: false,
            },
            {
              name: "✅ Assigned Role:",
              value: `${newMember.guild.roles.premiumSubscriberRole} | ${newMember.guild.roles.premiumSubscriberRole.name} | ${newMember.guild.roles.premiumSubscriberRole.id}`,
              inline: false,
            }
          )
          .setThumbnail(newMember.user.displayAvatarURL({ size: 1024 }))
          .setColor(newMember.guild.members.me.displayHexColor)
          .setFooter({
            text: `ID: ${newMember.user.id} (All Action Were Passed)`,
            iconURL: newMember.guild.iconURL({ size: 1024 }),
          })
          .setTimestamp();
        const boostLogMessage = await boostAnnounceChannel.send({
          embeds: [boostLogEmbed],
        });

        //Pin the Embed Message that send in Log channel
        boostLogMessage.pin();
      }
    }
    //Trigger when Member Unboost the server and remove the Nitro Booster Role
    if (
      oldMember.roles.cache.has(
        oldMember.guild.roles.premiumSubscriberRole.id
      ) &&
      !newMember.roles.cache.has(oldMember.guild.roles.premiumSubscriberRole.id)
    ) {
      const unboostEmbedLog = new EmbedBuilder()
        .setAuthor({
          name: `NEW UnBoost or Expired Detection System`,
          iconURL: client.user.displayAvatarURL(),
        })

        .addFields(
          {
            name: "📌 UnBooster:",
            value: `${oldMember.user} | ${oldMember.user.tag}`,
          },
          {
            name: "⏰ Account Created at:",
            value: `<t:${Math.round(
              oldMember.user.createdTimestamp / 1000
            )}:f> | <t:${Math.round(
              oldMember.user.createdTimestamp / 1000
            )}:R>`,
            inline: true,
          },
          {
            name: "📆 Joined Server at:",
            value: `<t:${Math.round(
              oldMember.joinedTimestamp / 1000
            )}:f> | <t:${Math.round(oldMember.joinedTimestamp / 1000)}:R>`,
            inline: true,
          },

          {
            name: "💜 Total Boost:",
            value: `${oldMember.guild.premiumSubscriptionCount} Boost | ${boostLevel}`,
            inline: false,
          },

          {
            name: "❌ Removed Role:",
            value: `${oldMember.guild.roles.premiumSubscriberRole} | ${oldMember.guild.roles.premiumSubscriberRole.name} | ${oldMember.guild.roles.premiumSubscriberRole.id}`,
            inline: false,
          }
        )
        .setThumbnail(oldMember.user.displayAvatarURL({ size: 1024 }))
        .setColor(oldMember.guild.members.me.displayHexColor)
        .setFooter({
          text: `ID: ${oldMember.user.id}`,
          iconURL: oldMember.guild.iconURL({ size: 1024 }),
        })
        .setTimestamp();
      const unboostLogMessage = await boostAnnouceLogChannel.send({
        embeds: [unboostEmbedLog],
      });

      unboostLogMessage.pin();

      //Send DM to NEW UnBooster
      oldMember.send({
        content: `> **Message Form Boost Detection System**\n\n> Hello ${oldMember.user.tag}, Unfortunately Your Nitro Boost For **__${oldMember.guild.name}__** Server Has Been Expired And You Lose Your Special And Cool Perks And Exclusive **${oldMember.guild.roles.premiumSubscriberRole.name}** Role :'(\n\n> 🎉By Boosting Again You Can Get This Perks Back!`,
      });
    }
  },
};
