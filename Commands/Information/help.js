const {
  EmbedBuilder,
  SlashCommandBuilder,
  StringSelectMenuBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Need help? Shows all commands of bot."),

  async execute(interaction, client) {
    let servers = await client.guilds.cache.size;
    let users = await client.guilds.cache.reduce(
      (a, b) => a + b.memberCount,
      0
    );
    const embed = new EmbedBuilder()
      .setAuthor({
        name: "Evolution X",
        iconURL: client.user.avatarURL(),
        url: `https://discord.com/api/oauth2/authorize?client_id=1002188910560026634&permissions=8&scope=bot%20applications.commands`,
      })

      .setDescription(
        `<a:icon_wave:1085041938933219409> Welcome to Evolution X's help menu. Use the menu below to navigate to the menu of your choice. In Case of functional trouble, Join our [Support Server](https://discord.gg/5FzKutmwSw).
          
           • **Commands Help**
            > Get all Commands purposes.
           • **How to add Bot**
            > Quick guide on how to add our Bot to your server.
           • **Feedback**
            > How to send us feedback and suggestions.
           • **Exclusive Functionality**
            > Guide on how to receive permission to use exclusive functionality.
            `
      )

      .setImage(
        `https://media.discordapp.net/attachments/1077409692302721154/1089068340141641739/wallpaperflare.com_wallpaper.png?width=960&height=313`
      )
      .setThumbnail(client.user.avatarURL({ size: 512 }))
      .setFooter({
        text: `Made with 💖 by ItzJarvis`,
        iconURL: client.user.avatarURL(),
      })
      .setColor(client.config.embed);

    const embed67 = new EmbedBuilder()
      .setAuthor({
        name: "Evolution X",
        iconURL: client.user.avatarURL(),
        url: "https://discord.com/api/oauth2/authorize?client_id=1002188910560026634&permissions=8&scope=bot%20applications.commands",
      })
      .setDescription(
        `• Hey! :wave:
  • Total commands: ${client.commands.size}
  • Get [\`Evolution X\`](https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=303600576574&scope=bot%20applications.commands) | [\`Support server\`](https://discord.gg/5FzKutmwSw) | [\`Vote Me\`](https://top.gg/bot/1002188910560026634/vote)
  • In \`${servers}\` servers with \`${users}\` members`
      )
      .setImage(
        `https://media.discordapp.net/attachments/1077409692302721154/1089068340141641739/wallpaperflare.com_wallpaper.png?width=960&height=313`
      )
      .addFields({
        name: `__**Main**__`,
        value: `<:reply:1087659970146881578><:automod:1077895682888839208> Automod\n<:reply:1087659970146881578><:setup:1089178942688211026> Setup\n<:reply:1087659970146881578><:mod:1077948388303187999> Moderation\n<:reply:1087659970146881578><:fun:1077898503298228274> Fun\n<:reply:1087659970146881578><:giveaway:1077898508746620938> Giveaways\n<:reply:1087659970146881578><:info:1077946907919405148> Information\n<:reply:1087659970146881578><a:a1_music:962663383923048478> Music`,
        inline: true,
      })
      .addFields({
        name: `**__Extras__**`,
        value: `<:reply:1087659970146881578><:ps:1077898522160021545> Images\n<:reply:1087659970146881578><:utility:1077898527713263696> Utilities\n<:reply:1087659970146881578><:error:1077950407298519110> Tools\n<:reply:1087659970146881578><a:premium:1086932430935564419> Premium Commands\n<:reply:1087659970146881578><:youtube:945710479265923113> Youtube Commands`,
        inline: true,
      })
      .setThumbnail(client.user.avatarURL({ size: 512 }))
      .setFooter({
        text: `Made with 💖 by ItzJarvis`,
        iconURL: client.user.avatarURL(),
      })
      .setColor(client.config.embed);

    // Embed Invite
    const embedinvite = new EmbedBuilder()
      .setTitle("> How to add our Bot")
      .setAuthor({
        name: "Evolution X",
        iconURL: client.user.avatarURL(),
        url: "https://discord.com/api/oauth2/authorize?client_id=1002188910560026634&permissions=8&scope=bot%20applications.commands",
      })
      .setThumbnail(client.user.avatarURL({ size: 512 }))
      .setFooter({
        text: `Made with 💖 by ItzJarvis`,
        iconURL: client.user.avatarURL(),
      })
      .setDescription(
        `<:arrowBlue:1087988547220422706> **How to add our bot to your server**
            > To add our bot, visit our bot's profile and
            press on 'Add To Server'.
  
            <:arrowBlue:1087988547220422706> **How to get help from support server?**
            > To add that fuctionality, visit our official Discord server
            > head to 'how-to-add-bot. There, you will be informed about our application, complete it and
            > you will have the feature in no time!
  
            <:arrowBlue:1087988547220422706> **Wait.. what Official Discord server..**
            > This is our Discord server: https://discord.gg/5FzKutmwSw
            `
      );

    // Embed Invite
    const embedfeedback = new EmbedBuilder()
      .setTitle("> How to give us Feedback")
      .setAuthor({
        name: "Evolution X",
        iconURL: client.user.avatarURL(),
        url: "https://discord.com/api/oauth2/authorize?client_id=1002188910560026634&permissions=8&scope=bot%20applications.commands",
      })
      .setThumbnail(client.user.avatarURL({ size: 512 }))
      .setFooter({
        text: `Made with 💖 by ItzJarvis`,
        iconURL: client.user.avatarURL(),
      })
      .setDescription(
        `<:arrowBlue:1087988547220422706> **How can I give Feedback?**
          > The creator of Evolution X appreciates your opinion on our his bot. To send feedback or suggestions, use the commands bellow..
  
          <:arrowBlue:1087988547220422706> **/bot feedback**
          > Opens up a feedback form
          
          <:arrowBlue:1087988547220422706> **/bot suggest**
          > Opens up a suggestion form
          `
      );

    // Embed Features
    const embedfeatuers = new EmbedBuilder()
      .setAuthor({
        name: "Evolution X",
        iconURL: client.user.avatarURL(),
        url: "https://discord.com/api/oauth2/authorize?client_id=1002188910560026634&permissions=8&scope=bot%20applications.commands",
      })
      .setDescription(
        `> **Introducing 🚀 **Evolution X** 🤖 - the ultimate Discord bot that offers a wide range of exclusive features designed to enhance your Discord server. With Evolution X, you can enjoy powerful 🛡️ automoderation and moderation tools, customizable 🛠️ server setups, 🎉 fun and engaging commands, and a suite of essential utilities to streamline your Discord experience.**
  
        > **Our bot's automoderation and moderation features are second to none, offering advanced filtering and customization options to keep your server safe and secure. With features such as anti-spam, anti-link, and anti-raid protection, you can rest assured that your server is protected from unwanted behavior.**
        
        > **Our customizable server setups allow you to easily configure your server with just a few clicks, saving you time and effort. You can also choose from a wide range of fun and engaging commands, including 🎮 trivia, 😂 memes, and more, to keep your server members entertained.**
        
        > **Our bot also offers a suite of essential utilities, including 🌤️ weather forecasts, ⏰ time zone conversions, and more, to make your Discord experience as convenient as possible.**
        
        > **🚀 Evolution X 🤖 is the perfect addition to any Discord server, offering a wide range of exclusive features designed to take your server to the next level. Try it today and experience the power of 🚀 Evolution X 🤖 for yourself!**`
      )
      .setThumbnail(client.user.avatarURL({ size: 512 }))
      .setFooter({
        text: `Made with 💖 by ItzJarvis`,
        iconURL: client.user.avatarURL(),
      })

      .setColor(client.config.embed);
    // Embed Automod
    const embed14 = new EmbedBuilder()
      .setAuthor({
        name: "Automod",
        iconURL: client.user.avatarURL(),
        url: "https://discord.com/api/oauth2/authorize?client_id=1002188910560026634&permissions=8&scope=bot%20applications.commands",
      })
      .setColor(client.config.embed)
      .setThumbnail(client.user.avatarURL({ size: 512 }))
      .setFooter({
        text: `Made with 💖 by ItzJarvis`,
        iconURL: client.user.avatarURL(),
      })
      .setDescription(
        `• \`automod flagged-words\`, \`automod spam-messages\`, \`automod keyword\`, \`automod mentions-spam\``
      );

    // Embed Utility
    const embed5 = new EmbedBuilder()
      .setAuthor({
        name: "Utility",
        iconURL: client.user.avatarURL(),
        url: "https://discord.com/api/oauth2/authorize?client_id=1002188910560026634&permissions=8&scope=bot%20applications.commands",
      })
      .setColor(client.config.embed)
      .setThumbnail(client.user.avatarURL({ size: 512 }))
      .setFooter({
        text: `Made with 💖 by ItzJarvis`,
        iconURL: client.user.avatarURL(),
      })
      .setDescription(
        `• \`afk set\`, \`set remove\`, \`steal\`, \`webhook create\`, \`webhook delete\`, \`webhook edit\`, \`utilities enlarge\`, \`utilities emoji-list\`, \`utilities enlarge\`, \`utilities ask-gpt\`, \`reminder set\`, \`reminder cancel\`, \`reminder cancel-all\``
      );

    // Embed Fun
    const embed2 = new EmbedBuilder()
      .setAuthor({
        name: "Fun Commands",
        iconURL: client.user.avatarURL(),
        url: "https://discord.com/api/oauth2/authorize?client_id=1002188910560026634&permissions=8&scope=bot%20applications.commands",
      })
      .setThumbnail(client.user.avatarURL({ size: 512 }))
      .setFooter({
        text: `Made with 💖 by ItzJarvis`,
        iconURL: client.user.avatarURL(),
      })
      .setDescription(
        `• \`fun pp-size\`, \`fun impersonate\`, \`fun advice\`, \`fun dice-roll\`, \`fun joke\`, \`fun kiss\`, \`fun \`, \`fun coin-flip\`, \`fun slap\``
      )
      .setColor(client.config.embed);

    // Embed Information
    const embed3 = new EmbedBuilder()
      .setAuthor({
        name: "Information Commands",
        iconURL: client.user.avatarURL(),
        url: "https://discord.com/api/oauth2/authorize?client_id=1002188910560026634&permissions=8&scope=bot%20applications.commands",
      })
      .setThumbnail(client.user.avatarURL({ size: 512 }))
      .setFooter({
        text: `Made with 💖 by ItzJarvis`,
        iconURL: client.user.avatarURL(),
      })
      .setDescription(
        `• \`bot invite\`, \`bot info\`, \`bot ping\`, \`bot vote\`, \`bot uptime\`, \`bot changelogs\`, \`bot feedback\`, \`bot report-bug\`, \`bot suggest\`, \`bot support\`, \`userinfo\`, \`help\`, \`membercount\`, \`serverinfo\``
      )
      .setColor(client.config.embed);

    // Embed Moderation
    const embed4 = new EmbedBuilder()
      .setAuthor({
        name: "Moderation Commands",
        iconURL: client.user.avatarURL(),
        url: "https://discord.com/api/oauth2/authorize?client_id=1002188910560026634&permissions=8&scope=bot%20applications.commands",
      })
      .setThumbnail(client.user.avatarURL({ size: 512 }))
      .setFooter({
        text: `Made with 💖 by ItzJarvis`,
        iconURL: client.user.avatarURL(),
      })
      .setDescription(
        `• \`ban\`, \`kick\`, \`lockdown commit\`, \`lockdown unlock\`, \`lockdown blacklist-add\`, \`lockdown blacklist-remove\`, \`mass-unban\`, \`nick\`, \`role add\`, \`role remove\`, \`role create\`, \`role delete\`, \`role members\`, \`slowmode set\`, \`slowmode disable\`, , \`snipe\`\`timeout\`, \`untimeout\`, \`kick\`, \`warn user\`, \`warn remove\`, \`warn show\`, \`purge human\`, \`purge bot\`, \`purge all\``
      )
      .setColor(client.config.embed);

    // Embed Giveaways
    const embed9 = new EmbedBuilder()
      .setAuthor({
        name: "Giveaway Commands",
        iconURL: client.user.avatarURL(),
        url: "https://discord.com/api/oauth2/authorize?client_id=1002188910560026634&permissions=8&scope=bot%20applications.commands",
      })
      .setColor(client.config.embed)
      .setThumbnail(client.user.avatarURL({ size: 512 }))
      .setFooter({
        text: `Made with 💖 by ItzJarvis`,
        iconURL: client.user.avatarURL(),
      })
      .setDescription(
        `• \`/giveaway start\`, \`/giveaway edit\`, \`/giveaway end\`, \`/giveaway reroll\``
      );

    // Embed Image
    const embed10 = new EmbedBuilder()
      .setAuthor({
        name: "Image Commands",
        iconURL: client.user.avatarURL(),
        url: "https://discord.com/api/oauth2/authorize?client_id=1002188910560026634&permissions=8&scope=bot%20applications.commands",
      })
      .setColor(client.config.embed)
      .setThumbnail(client.user.avatarURL({ size: 512 }))
      .setFooter({
        text: `Made with 💖 by ItzJarvis`,
        iconURL: client.user.avatarURL(),
      })
      .setDescription(
        `• \`images fake-tweet\`, \`images cat\`, \`images memes\`, \`images dog\`, \`images gay\`, \`images cricle-crop\`, \`images fake-ytcomment\`, \`images jail\`, \`images passed\`, \`images comrade\`, \`/images glass\`, \`images pixelate\`, \`images triggered\``
      );
    // Embed Premium
    const embed11 = new EmbedBuilder()
      .setAuthor({
        name: "Premium Commands",
        iconURL: client.user.avatarURL(),
        url: "https://discord.com/api/oauth2/authorize?client_id=1002188910560026634&permissions=8&scope=bot%20applications.commands",
      })
      .setColor(client.config.embed)
      .setThumbnail(client.user.avatarURL({ size: 512 }))
      .setFooter({
        text: `Made with 💖 by ItzJarvis`,
        iconURL: client.user.avatarURL(),
      })
      .setDescription(`• \`imagine\`, \`remove-bg\`, \`tools shorten\``);

    // Embed Setup
    const embed12 = new EmbedBuilder()
      .setAuthor({
        name: "Setups Commands",
        iconURL: client.user.avatarURL(),
        url: "https://discord.com/api/oauth2/authorize?client_id=1002188910560026634&permissions=8&scope=bot%20applications.commands",
      })
      .setColor(client.config.embed)
      .setThumbnail(client.user.avatarURL({ size: 512 }))
      .setFooter({
        text: `Made with 💖 by ItzJarvis`,
        iconURL: client.user.avatarURL(),
      })
      .setDescription(
        `• \`anti-ghostping setup\`, \`anti-ghostping disable\`, \`anti-ghostping number-reset\`,\`join-to-create setup\`, \`join-to-create disable\`, \`confess setup\`, \`confess send\`, \`confess disable\`, \`counting setup\`, \`counting disable\`, \`verify setup\`, \`verify bypass\`, \`verify remove\`, \`verify disable\`, \`auto-role set\`, \`auto-role remove\`, \`join-ping add\`, \`join-ping disable\`, \`join-ping remove\`, \`staff-role set\`, \`staff-role remove\`, \`staff-help\`, \`welcome-channel set\`, \`welcome-channel remove\`, \`suggest-panel setup\`, \`suggest-panel delete\`, \`suggest-manage\`, \`suggest\`, \`logs setup\`, \`logs disable\`, \`poll setup\`, \`poll disable\``
      );

    // Embed Youtube
    const ytembed = new EmbedBuilder()
      .setAuthor({
        name: "Youtube Commands",
        iconURL: client.user.avatarURL(),
        url: "https://discord.com/api/oauth2/authorize?client_id=1002188910560026634&permissions=8&scope=bot%20applications.commands",
      })
      .setColor(client.config.embed)
      .setThumbnail(client.user.avatarURL({ size: 512 }))
      .setFooter({
        text: `Made with 💖 by ItzJarvis`,
        iconURL: client.user.avatarURL(),
      })
      .setDescription(
        `• \`youtube add\`, \`youtube info\`, \`youtube latestvideo\`, \`youtube remove\`, \`youtube removeall\``
      );

    // Embed Tools
    const embed13 = new EmbedBuilder()
      .setAuthor({
        name: "Tools Commands",
        iconURL: client.user.avatarURL(),
        url: "https://discord.com/api/oauth2/authorize?client_id=1002188910560026634&permissions=8&scope=bot%20applications.commands",
      })
      .setColor(client.config.embed)
      .setThumbnail(client.user.avatarURL({ size: 512 }))
      .setFooter({
        text: `Made with 💖 by ItzJarvis`,
        iconURL: client.user.avatarURL(),
      })
      .setDescription(
        `\`tools calculator\`, \`tools mcstatus\`, \`tools docs\`, \`tools translate\`, \`tools weather\`, \`tools tts\`, \`tools base64 encode\`, \`tools base64 decode\``
      );

    // Embed Music
    const embedmusic = new EmbedBuilder()
      .setAuthor({
        name: "Music Commands",
        iconURL: client.user.avatarURL(),
        url: "https://discord.com/api/oauth2/authorize?client_id=1002188910560026634&permissions=8&scope=bot%20applications.commands",
      })
      .setColor(client.config.embed)
      .setThumbnail(client.user.avatarURL({ size: 512 }))
      .setFooter({
        text: `Made with 💖 by ItzJarvis`,
        iconURL: client.user.avatarURL(),
      })
      .setDescription(
        `\`247\`, \`forward\`, \`loop\`, \`nowplaying\`, \`pause\`, \`lyrics\`, \`play\`, \`queue\`, \`replay\`, \`resume\`, \`rewind\`, \`shuffle\`, \`skip\`, \`stop\`, \`volume\`, \`radio\``
      );

    // Buttons

    const button = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setURL(
          `https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=303600576574&scope=bot%20applications.commands`
        )
        .setLabel(`Invite Me`)
        .setStyle(ButtonStyle.Link),

      new ButtonBuilder()
        .setURL(`https://discord.gg/5FzKutmwSw`)
        .setLabel(`Support Server`)
        .setStyle(ButtonStyle.Link),

      new ButtonBuilder()
        .setURL(`https://top.gg/bot/1002188910560026634/vote`)
        .setLabel(`Vote`)
        .setStyle(ButtonStyle.Link)
    );

    let rowmenu1 = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId("menu2")
        .setPlaceholder("Evolution X | Help Menu")
        .setMinValues(1)
        .setMaxValues(1)
        .addOptions([
          {
            label: "How to Add Bot",
            value: "add",
            emoji: `<:ps:1087983113273102359>`,
            description: "Quick guide on how to add our Bot to your server.",
          },
          {
            label: "Commands",
            value: "commands",
            emoji: `<:info:1087983008855904266>`,
            description: "All commands of bot",
          },
          {
            label: "Feedback",
            value: "feedback",
            emoji: `<:mod:1087983095833165854>`,
            description: "Give developer the feedback of bot.",
          },
          {
            label: "Exclusive Features",
            value: "ef",
            emoji: `<:premium:1087983106725781514>`,
            description:
              "Guide on how to receive permission to use exclusive functionality.",
          },
        ])
    );

    let rowmenu = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId("menu2")
        .setPlaceholder("Evolution X | Help Menu")
        .setMinValues(1)
        .setMaxValues(1)
        .addOptions([
          {
            label: "Help Page",
            value: "overview",
            emoji: `<:home:1087982954065702952>`,
            description: "Overview help menu of bot",
          },
          {
            label: "Automod",
            value: "automod",
            emoji: `<:automod:1092336803975020544>`,
            description: "All commands related to automod.",
          },
          {
            label: "Fun",
            value: "option2",
            emoji: `<:fun:1087982867482673153>`,
            description: "All commands related to fun.",
          },
          {
            label: "Giveaway",
            value: "giveaway",
            emoji: `<:giveaway:1087982891826421770>`,
            description: "All commands related to giveaway.",
          },
          {
            label: "Image",
            value: "image",
            emoji: `<:ps:1087983113273102359>`,
            description: "All commands related to images.",
          },
          {
            label: "Information",
            value: "option3",
            emoji: `<:info:1087983008855904266>`,
            description: "All commands related to information.",
          },
          {
            label: "Moderation",
            value: "option4",
            emoji: `<:mod:1087983095833165854>`,
            description: "All commands related to moderation.",
          },
          {
            label: "Music",
            value: "music",
            emoji: `<:music:1102606697941438536>`,
            description: "All commands related to music.",
          },
          {
            label: "Premium Commands",
            value: "premium",
            emoji: `<:premium:1087983106725781514>`,
            description: "All commands related to premium.",
          },
          {
            label: "Setups",
            value: "setup",
            emoji: `<:suggestion:1087983132789190757>`,
            description: "All commands related to suggestion.",
          },
          {
            label: "Tools",
            value: "tools",
            emoji: `<:tools:1087983139311333376>`,
            description: "All commands related to tools.",
          },
          {
            label: "Utility",
            value: "option5",
            emoji: `<:setting:1087983121338744862>`,
            description: "All commands related to utilities.",
          },
          {
            label: "Youtube",
            value: "yt",
            emoji: `<:setting:1087983121338744862>`,
            description: "All commands related to youtube.",
          },
        ])
    );

    const MESSAGE = await interaction.reply({
      content: `## Source Code Available for €5 | Dm ItzJarvis#9017`,
      embeds: [embed],
      components: [rowmenu1, button],
      ephemeral: false,
    });
    const filter = (button) => button.user.id === interaction.user.id;
    const collector = MESSAGE.createMessageComponentCollector();

    collector.on("collect", async (b) => {
      if (b.values[0] == "overview") {
        await b.update({
          embeds: [embed],
          components: [rowmenu1, button],
          ephemeral: false,
        });
      }

      if (b.values[0] == "commands") {
        await b.update({
          embeds: [embed67],
          components: [rowmenu, button],
          ephemeral: false,
        });
      }

      if (b.values[0] == "add") {
        await b.update({
          embeds: [embedinvite],
          components: [rowmenu1, button],
          ephemeral: false,
        });
      }

      if (b.values[0] == "ef") {
        await b.update({
          embeds: [embedfeatuers],
          components: [rowmenu1, button],
          ephemeral: false,
        });
      }

      if (b.values[0] == "feedback") {
        await b.update({
          embeds: [embedfeedback],
          components: [rowmenu1, button],
          ephemeral: false,
        });
      }

      if (b.values[0] == "option2") {
        await b.update({
          embeds: [embed2],
          components: [rowmenu, button],
          ephemeral: false,
        });
      }

      if (b.values[0] == "automod") {
        await b.update({
          embeds: [embed14],
          components: [rowmenu, button],
          ephemeral: false,
        });
      }

      if (b.values[0] == "option3") {
        await b.update({
          embeds: [embed3],
          components: [rowmenu, button],
          ephemeral: false,
        });
      }
      if (b.values[0] == "giveaway") {
        await b.update({
          embeds: [embed9],
          components: [rowmenu, button],
          ephemeral: false,
        });
      }

      if (b.values[0] == "option4") {
        await b.update({
          embeds: [embed4],
          components: [rowmenu, button],
          ephemeral: false,
        });
      }
      if (b.values[0] == "music") {
        await b.update({
          embeds: [embedmusic],
          components: [rowmenu, button],
          ephemeral: false,
        });
      }

      if (b.values[0] == "tools") {
        await b.update({
          embeds: [embed13],
          components: [rowmenu, button],
          ephemeral: false,
        });
      }

      if (b.values[0] == "yt") {
        await b.update({
          embeds: [ytembed],
          components: [rowmenu, button],
          ephemeral: false,
        });
      }

      if (b.values[0] == "image") {
        await b.update({
          embeds: [embed10],
          components: [rowmenu, button],
          ephemeral: false,
        });
      }

      if (b.values[0] == "setup") {
        await b.update({
          embeds: [embed12],
          components: [rowmenu, button],
          ephemeral: false,
        });
      }

      if (b.values[0] == "premium") {
        await b.update({
          embeds: [embed11],
          components: [rowmenu, button],
          ephemeral: false,
        });
      }

      if (b.values[0] == "option5") {
        await b.update({
          embeds: [embed5],
          components: [rowmenu, button],
          ephemeral: false,
        });
      }
    });
  },
};
