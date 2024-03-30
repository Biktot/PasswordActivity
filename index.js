require("dotenv").config();
const {
  Client,
  MessageType,
  GatewayIntentBits,
  Partials,
  Collection,
  PermissionsBitField,
  AttachmentBuilder,
  EmbedBuilder,
  ChannelType,
  ModalBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  TextInputBuilder,
  TextInputStyle,
  Events,
} = require("discord.js");

const { DisTube } = require("distube");
const { SpotifyPlugin } = require("@distube/spotify");
const { SoundCloudPlugin } = require("@distube/soundcloud");
const { YtDlpPlugin } = require("@distube/yt-dlp");
const { handleLogs } = require("./Events/Other/handleLogs");
const { CaptchaGenerator } = require("captcha-canvas");
const YoutubePoster = require("discord-youtube");
const GiveawaysManager = require("./Handlers/giveaway");
const { loadEvents } = require("./Handlers/eventHandler");
const { loadCommands } = require("./Handlers/commandHandler");
const { prefixCommands } = require("./Handlers/prefixHandler");
const { loadModals } = require("./Handlers/modalHandler");
const { loadButtons } = require("./Handlers/buttonHandler");

const client = new Client({
  intents: [
    GatewayIntentBits.AutoModerationConfiguration,
    GatewayIntentBits.AutoModerationExecution,
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.DirectMessageTyping,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildBans,
    GatewayIntentBits.GuildEmojisAndStickers,
    GatewayIntentBits.GuildIntegrations,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMessageTyping,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildScheduledEvents,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildWebhooks,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
  ],
  partials: [
    Partials.Channel,
    Partials.GuildMember,
    Partials.GuildScheduledEvent,
    Partials.Message,
    Partials.Reaction,
    Partials.ThreadMember,
    Partials.User,
  ],
});

client.config = require("./config.json");
client.ytp = new YoutubePoster(client);
client.cooldowns = new Collection();
client.pcommands = new Collection();
client.aliases = new Collection();
client.commands = new Collection();
client.events = new Collection();
client.modals = new Collection();
client.buttons = new Collection();

client.distube = new DisTube(client, {
  emitNewSongOnly: true,
  leaveOnFinish: false, // you can change this to your needs
  emitAddSongWhenCreatingQueue: false,
  plugins: [new SpotifyPlugin()],
});

const Logs = require("discord-logs");
const process = require("node:process");
Logs(client, {
  debug: true,
});

client.giveawayManager = new GiveawaysManager(client, {
  default: {
    botsCanWin: false,
    embedColor: "#a200ff",
    embedColorEnd: "#550485",
    reaction: "🎉",
  },
});
loadEvents(client);
client
  .login(process.env.token)
  .then(() => {
    prefixCommands(client);
    loadCommands(client);
    loadModals(client);
    loadButtons(client);
    handleLogs(client);
  })
  .catch((err) => console.log(err));

// Error Handler

client.on("error", (err) => {
  const ChannelID = client.config.logchannel;
  console.log("Discord API Error:", err);
  const Embed = new EmbedBuilder()
    .setColor(client.config.embed)
    .setTimestamp()
    .setFooter({ text: "⚠️ Anti Crash system" })
    .setTitle("Error Encountered");
  const Channel = client.channels.cache.get(ChannelID);
  if (!Channel) return;
  Channel.send({
    embeds: [
      Embed.setDescription(
        "**Discord API Error/Catch:\n\n** ```" + err + "```"
      ),
    ],
  });
});
process.on("unhandledRejection", (reason, p) => {
  const ChannelID = client.config.logchannel;
  console.log(" [Error_Handling] :: Unhandled Rejection/Catch", reason, p);
  const Embed = new EmbedBuilder()
    .setColor(client.config.embed)
    .setTimestamp()
    .setFooter({ text: "⚠️ Anti Crash system" })
    .setTitle("Error Encountered");
  const Channel = client.channels.cache.get(ChannelID);
  if (!Channel) return;
  Channel.send({
    embeds: [
      Embed.setDescription(
        "**Unhandled Rejection/Catch:\n\n** ```" + reason + "```"
      ),
    ],
  });
});

process.on("uncaughtException", (err, origin) => {
  const ChannelID = client.config.logchannel;
  console.log("Uncaught Exception:", err, origin);
  const Embed = new EmbedBuilder()
    .setColor(client.config.embed)
    .setTimestamp()
    .setFooter({ text: "⚠️ Anti Crash system" })
    .setTitle("Error Encountered");
  const Channel = client.channels.cache.get(ChannelID);
  if (!Channel) return;
  Channel.send({
    embeds: [
      Embed.setDescription(
        "**Uncought Exception/Catch:\n\n** ```" + err + "```"
      ),
    ],
  });
});

process.on("uncaughtExceptionMonitor", (err, origin) => {
  const ChannelID = client.config.logchannel;
  console.log("Uncaught Exception Monitor:", err, origin);
  const Embed = new EmbedBuilder()
    .setColor(client.config.embed)
    .setTimestamp()
    .setFooter({ text: "⚠️ Anti Crash system" })
    .setTitle("Error Encountered");
  const Channel = client.channels.cache.get(ChannelID);
  if (!Channel) return;
  Channel.send({
    embeds: [
      Embed.setDescription(
        "**Uncaught Exception Monitor/Catch:\n\n** ```" + err + "```"
      ),
    ],
  });
});

process.on("warning", (warn) => {
  const ChannelID = client.config.logchannel;
  console.log("Warning:", warn);
  const Embed = new EmbedBuilder()
    .setColor(client.config.embed)
    .setTimestamp()
    .setFooter({ text: "⚠️ Anti Crash system" })
    .setTitle("Error Encountered");
  const Channel = client.channels.cache.get(ChannelID);
  if (!Channel) return;
  Channel.send({
    embeds: [Embed.setDescription("**Warning/Catch:\n\n** ```" + warn + "```")],
  });
});
/*process.on("unhandledRejection", (reason, promise) => {
  console.log(" [Error_Handling] :: Unhandled Rejection/Catch");
  console.log(reason, "\n", promise);
});
process.on("uncaughtException", (err, origin) => {
  console.log(" [Error_Handling] :: Uncaught Exception/Catch");
  console.log(err, "\n", origin);
});
process.on("uncaughtExceptionMonitor", (err, origin) => {
  console.log(" [Error_Handling] :: Uncaught Exception/Catch (MONITOR)");
  console.log(err, "\n", origin);
});
process.on("multipleResolves", (type, promise, reason) => {
  // console.log(" [Error_Handling] :: Multiple Resolves");
  // console.log(type, promise, reason);
  // console.log(reason);
});*/

client.on("guildDelete", (guild) => {
  console.log("Left a guild: " + guild.name);

  const embed = new EmbedBuilder()
    .setTitle(`Left A Server`)
    .setColor(`Red`)
    .setTimestamp()
    .addFields(
      {
        name: `Guild ID`,
        value: `${guild.id}`,
      },
      {
        name: `Guild Name`,
        value: `${guild.name}`,
      }
    );
  client.channels.cache
    .get("1102134118977900564")
    .send({ content: `Owner ID: ${guild.ownerId}`, embeds: [embed] });
});

client.on("guildCreate", (guild) => {
  console.log("Joined a new guild: " + guild.name);

  const embed = new EmbedBuilder()
    .setTitle(`**Joined A New Server**`)
    .setColor(`Green`)
    .setTimestamp()
    .addFields(
      {
        name: `Guild ID`,
        value: `${guild.id}`,
      },
      {
        name: `Guild Name`,
        value: `${guild.name}`,
      },
      {
        name: `Guild Members`,
        value: `${guild.memberCount}`,
      },
      {
        name: `Vanity`,
        value: `${guild.vanityURLCode}`,
      }
    );
  client.channels.cache
    .get("1102134088355282945")
    .send({ content: `Owner ID: ${guild.ownerId}`, embeds: [embed] });
});

// Mention Reply
client.on(Events.MessageCreate, async (message) => {
  if (message.content !== `<@${client.config.clientID}>`) {
    return;
  }

  const proofita = `\`\`\`css\n[     Prefix: /     ]\`\`\``;
  const proofitaa = `\`\`\`css\n[      Help: /help    ]\`\`\``;

  const embed = new EmbedBuilder()
    .setTitle("Hello, I'm Evolution X. What's Up?")
    .addFields({ name: `Prefix`, value: proofita, inline: true })
    .addFields({ name: `Usage`, value: proofitaa, inline: true })
    .setDescription(
      `\nIf you like Evolution X, Consider [voting](https://top.gg/bot/1002188910560026634/vote), or [inviting](https://discord.com/api/oauth2/authorize?client_id=1002188910560026634&permissions=8&scope=bot%20applications.commands) it to your server! Thank you for using Evolution X, we hope you enjoy it, as we always look forward to improve the bot`
    )
    .setFooter({ text: "Thanks For Using Evolution X" })
    .setColor(client.config.embed);

  message.channel.send({ embeds: [embed] });
});

// Guess The Number
client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot) return;

  const Schema = require("./Schemas/guess");

  const data = await Schema.findOne({ channelId: message.channel.id });

  if (!data) return;

  if (data) {
    if (message.content === `${data.number}`) {
      message.react(`✅`);
      message.reply(`Wow! That was the right number! 🥳`);
      message.pin();

      await data.delete();
      message.channel.send(
        `Successfully delted number, use \`/guess enable\` to get a new number!`
      );
    }

    if (message.content !== `${data.number}`) return message.react(`❌`);
  }
});

// Snipe
client.snipes = new Map();
client.on("messageDelete", function (message, channel) {
  client.snipes.set(message.channel.id, {
    content: message.content,
    author: message.author,
    image: message.attachments.first()
      ? message.attachments.first().proxyURL
      : null,
  });
});

//reminder
const remindSchema = require("./Schemas/remindSchema");
setInterval(async () => {
  const reminders = await remindSchema.find();
  if (!reminders) return;
  else {
    reminders.forEach(async (reminder) => {
      if (reminder.Time > Date.now()) return;

      const user = await client.users.fetch(reminder.User);

      user
        ?.send({
          content: `${user}, you asked me to remind you about: \`${reminder.Remind}\``,
        })
        .catch((err) => {
          return;
        });

      await remindSchema.deleteMany({
        Time: reminder.Time,
        User: user.id,
        Remind: reminder.Remind,
      });
    });
  }
}, 1000 * 5);

// Phoning

client.on(Events.MessageCreate, async (message) => {
  if (message.guild === null) return;
  const phoneschema = require("./Schemas/phoneschema");
  const phonedata = await phoneschema.findOne({ Guild: message.guild.id });

  if (!phonedata) return;
  else {
    const phonechannel = client.channels.cache.get(phonedata.Channel);

    if (message.author.id === "1002188910560026634") return;
    if (phonechannel.id !== message.channel.id) return;

    try {
      message.react("📧");
    } catch (err) {
      throw err;
    }

    multidata = await phoneschema.find({ Setup: "defined" });

    await Promise.all(
      multidata.map(async (data) => {
        const phonechannels = await client.channels.fetch(data.Channel);
        let phonemessage = message.content || "**No message provided!**";
        const filtermessage = phonemessage.toLowerCase();

        if (message.channel.id === phonechannels.id) return;

        const phoneembed = new EmbedBuilder()
          .setColor(client.config.embed)
          .setFooter({
            text: `📞 Message Received from: ${message.guild.name.slice(
              0,
              180
            )}`,
          })
          .setAuthor({ name: `📞 Phone System` })

          .setTimestamp()
          .setTitle(`> ${message.author.tag.slice(0, 256)}`)
          .setDescription(`${phonemessage.slice(0, 4000)}`);

        phonechannels
          .send({ embeds: [phoneembed] })
          .catch((err) =>
            console.log("Error received trying to phone a message!")
          );
        return phonechannels;
      })
    );
  }
});

// POLL SYSTEM //

const pollschema = require("./Schemas/votes");
const pollsetup = require("./Schemas/votesetup");

client.on(Events.MessageCreate, async (message) => {
  if (!message.guild) return;

  const setupdata = await pollsetup.findOne({ Guild: message.guild.id });
  if (!setupdata) return;

  if (message.channel.id !== setupdata.Channel) return;
  if (message.author.bot) return;

  const embed = new EmbedBuilder()
    .setColor(client.config.embed)
    .setAuthor({ name: `🤚 Poll System` })
    .setFooter({ text: `🤚 Poll Started` })
    .setTimestamp()
    .setTitle("• Poll Began")
    .setDescription(`> ${message.content}`)
    .addFields({ name: `• Upvotes`, value: `> **No votes**`, inline: true })
    .addFields({ name: `• Downvotes`, value: `> **No votes**`, inline: true })
    .addFields({ name: `• Author`, value: `> ${message.author}` });

  try {
    await message.delete();
  } catch (err) {}

  const buttons = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("up")
      .setLabel(" ")
      .setEmoji("<:tick:1102942811101335593>")
      .setStyle(ButtonStyle.Secondary),

    new ButtonBuilder()
      .setCustomId("down")
      .setLabel(" ")
      .setEmoji("<:crossmark:1102943024415260673>")
      .setStyle(ButtonStyle.Secondary),

    new ButtonBuilder()
      .setCustomId("votes")
      .setLabel("• Votes")
      .setStyle(ButtonStyle.Secondary)
  );

  const msg = await message.channel.send({
    embeds: [embed],
    components: [buttons],
  });
  msg.createMessageComponentCollector();

  await pollschema.create({
    Msg: msg.id,
    Upvote: 0,
    Downvote: 0,
    UpMembers: [],
    DownMembers: [],
    Guild: message.guild.id,
    Owner: message.author.id,
  });
});

client.on(Events.InteractionCreate, async (i) => {
  if (!i.guild) return;
  if (!i.message) return;

  const data = await pollschema.findOne({
    Guild: i.guild.id,
    Msg: i.message.id,
  });
  if (!data) return;
  const msg = await i.channel.messages.fetch(data.Msg);

  if (i.customId === "up") {
    if (i.user.id === data.Owner)
      return await i.reply({
        content: `❌ You **cannot** upvote your own **poll**!`,
        ephemeral: true,
      });
    if (data.UpMembers.includes(i.user.id))
      return await i.reply({
        content: `❌ You have **already** upvoted this **poll**`,
        ephemeral: true,
      });

    let downvotes = data.Downvote;
    if (data.DownMembers.includes(i.user.id)) {
      downvotes = downvotes - 1;
    }

    const newembed = EmbedBuilder.from(msg.embeds[0]).setFields(
      {
        name: `• Upvotes`,
        value: `> **${data.Upvote + 1}** Votes`,
        inline: true,
      },
      { name: `• Downvotes`, value: `> **${downvotes}** Votes`, inline: true },
      { name: `• Author`, value: `> <@${data.Owner}>` }
    );

    const buttons = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("up")
        .setEmoji("<:tick:1102942811101335593>")
        .setLabel(`${data.Upvote + 1}`)
        .setStyle(ButtonStyle.Secondary),

      new ButtonBuilder()
        .setCustomId("down")
        .setEmoji("<:crossmark:1102943024415260673>")
        .setLabel(`${downvotes}`)
        .setStyle(ButtonStyle.Secondary),

      new ButtonBuilder()
        .setCustomId("votes")
        .setLabel("• Votes")
        .setStyle(ButtonStyle.Secondary)
    );

    await i.update({ embeds: [newembed], components: [buttons] });

    data.Upvote++;

    if (data.DownMembers.includes(i.user.id)) {
      data.Downvote = data.Downvote - 1;
    }

    data.UpMembers.push(i.user.id);
    data.DownMembers.pull(i.user.id);
    data.save();
  }

  if (i.customId === "down") {
    if (i.user.id === data.Owner)
      return await i.reply({
        content: `❌ You **cannot** downvote your own **poll**!`,
        ephemeral: true,
      });
    if (data.DownMembers.includes(i.user.id))
      return await i.reply({
        content: `❌ You have **already** downvoted this **poll**`,
        ephemeral: true,
      });

    let upvotes = data.Upvote;
    if (data.UpMembers.includes(i.user.id)) {
      upvotes = upvotes - 1;
    }

    const newembed = EmbedBuilder.from(msg.embeds[0]).setFields(
      { name: `• Upvotes`, value: `> **${upvotes}** Votes`, inline: true },
      {
        name: `• Downvotes`,
        value: `> **${data.Downvote + 1}** Votes`,
        inline: true,
      },
      { name: `• Author`, value: `> <@${data.Owner}>` }
    );

    const buttons = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("up")
        .setEmoji("<:tick:1102942811101335593>")
        .setLabel(`${upvotes}`)
        .setStyle(ButtonStyle.Secondary),

      new ButtonBuilder()
        .setCustomId("down")
        .setEmoji("<:crossmark:1102943024415260673>")
        .setLabel(`${data.Downvote + 1}`)
        .setStyle(ButtonStyle.Secondary),

      new ButtonBuilder()
        .setCustomId("votes")
        .setLabel("• Votes")
        .setStyle(ButtonStyle.Secondary)
    );

    await i.update({ embeds: [newembed], components: [buttons] });

    data.Downvote++;

    if (data.UpMembers.includes(i.user.id)) {
      data.Upvote = data.Upvote - 1;
    }

    data.DownMembers.push(i.user.id);
    data.UpMembers.pull(i.user.id);
    data.save();
  }

  if (i.customId === "votes") {
    let upvoters = [];
    await data.UpMembers.forEach(async (member) => {
      upvoters.push(`<@${member}>`);
    });

    let downvoters = [];
    await data.DownMembers.forEach(async (member) => {
      downvoters.push(`<@${member}>`);
    });

    const embed = new EmbedBuilder()
      .setTitle("> Poll Votes")
      .setColor(client.config.embed)
      .setAuthor({ name: `🤚 Poll System` })
      .setFooter({ text: `🤚 Poll Members` })
      .setTimestamp()
      .addFields({
        name: `• Upvoters (${upvoters.length})`,
        value: `> ${upvoters.join(", ").slice(0, 1020) || "No upvoters"}`,
        inline: true,
      })
      .addFields({
        name: `• Downvoters (${downvoters.length})`,
        value: `> ${downvoters.join(", ").slice(0, 1020) || "No downvoters"}`,
        inline: true,
      });

    await i.reply({ embeds: [embed], ephemeral: true });
  }
});

// Join to Create
const joinschema = require("./Schemas/jointocreate");
const joinchannelschema = require("./Schemas/jointocreatechannels");

client.on(Events.VoiceStateUpdate, async (oldState, newState) => {
  if (!newState.guild) return;
  try {
    if (newState.member.guild === null) return;
  } catch (err) {
    return;
  }
  if (!newState.member.guild) return;

  if (newState.member.id === "1002188910560026634") return;

  const joindata = await joinschema.findOne({
    Guild: newState.member.guild.id,
  });
  const joinchanneldata1 = await joinchannelschema.findOne({
    Guild: newState.member.guild.id,
    User: newState.member.id,
  });

  const voicechannel = newState.channel;

  if (!joindata) return;

  if (!voicechannel) return;
  else {
    if (voicechannel.id === joindata.Channel) {
      if (joinchanneldata1) {
        try {
          const joinfail = new EmbedBuilder()
            .setColor(client.config.embed)
            .setTimestamp()
            .setAuthor({ name: `🔊 Join to Create System` })
            .setFooter({ text: `🔊 Issue Faced` })
            .setTitle("> You tried creating a \n> voice channel but..")
            .addFields({
              name: `• Error Occured`,
              value: `> You already have a voice channel \n> open at the moment.`,
            });

          return await newState.member.send({ embeds: [joinfail] });
        } catch (err) {
          return;
        }
      } else {
        try {
          const channel = await newState.member.guild.channels.create({
            type: ChannelType.GuildVoice,
            name: `${newState.member.user.username}-room`,
            userLimit: joindata.VoiceLimit,
            parent: joindata.Category,
          });

          try {
            await newState.member.voice.setChannel(channel.id);
          } catch (err) {
            console.log("Error moving member to the new channel!");
          }

          setTimeout(() => {
            joinchannelschema.create({
              Guild: newState.member.guild.id,
              Channel: channel.id,
              User: newState.member.id,
            });
          }, 500);
        } catch (err) {
          console.log(err);

          try {
            const joinfail = new EmbedBuilder()
              .setColor(client.config.embed)
              .setTimestamp()
              .setAuthor({ name: `🔊 Join to Create System` })
              .setFooter({ text: `🔊 Issue Faced` })
              .setTitle("> You tried creating a \n> voice channel but..")
              .addFields({
                name: `• Error Occured`,
                value: `> I could not create your channel, \n> perhaps I am missing some permissions.`,
              });

            await newState.member.send({ embeds: [joinfail] });
          } catch (err) {
            return;
          }

          return;
        }

        try {
          const joinsuccess = new EmbedBuilder()
            .setColor(client.config.embed)
            .setTimestamp()
            .setAuthor({ name: `🔊 Join to Create System` })
            .setFooter({ text: `🔊 Channel Created` })
            .setTitle("> Channel Created")
            .addFields({
              name: `• Channel Created`,
              value: `> Your voice channel has been \n> created in **${newState.member.guild.name}**!`,
            });

          await newState.member.send({ embeds: [joinsuccess] });
        } catch (err) {
          return;
        }
      }
    }
  }
});

client.on(Events.VoiceStateUpdate, async (oldState, newState) => {
  try {
    if (oldState.member.guild === null) return;
  } catch (err) {
    return;
  }

  if (oldState.member.id === "1002188910560026634") return;

  const leavechanneldata = await joinchannelschema.findOne({
    Guild: oldState.member.guild.id,
    User: oldState.member.id,
  });

  if (!leavechanneldata) return;
  else {
    const voicechannel = await oldState.member.guild.channels.cache.get(
      leavechanneldata.Channel
    );

    if (newState.channel === voicechannel) return;

    try {
      await voicechannel.delete();
    } catch (err) {
      return;
    }

    await joinchannelschema.deleteMany({
      Guild: oldState.guild.id,
      User: oldState.member.id,
    });
    try {
      const deletechannel = new EmbedBuilder()
        .setColor(client.config.embed)
        .setTimestamp()
        .setAuthor({ name: `🔊 Join to Create System` })
        .setFooter({ text: `🔊 Channel Deleted` })
        .setTitle("> Channel Deleted")
        .addFields({
          name: `• Channel Deleted`,
          value: `> Your voice channel has been \n> deleted in **${newState.member.guild.name}**!`,
        });

      await newState.member.send({ embeds: [deletechannel] });
    } catch (err) {
      return;
    }
  }
});

// Leave Message
const welcomeschema = require("./Schemas/welcome");
const roleschema = require("./Schemas/autorole");
client.on(Events.GuildMemberRemove, async (member, err) => {
  const leavedata = await welcomeschema.findOne({ Guild: member.guild.id });

  if (!leavedata) return;
  else {
    const channelID = leavedata.Channel;
    const channelwelcome = member.guild.channels.cache.get(channelID);

    const embedleave = new EmbedBuilder()
      .setColor(client.config.embed)
      .setTitle(`${member.user.username} has left`)
      .setDescription(`> ${member} has left the Server`)
      .setFooter({ text: `👋 Cast your goodbyes` })
      .setTimestamp()
      .setAuthor({ name: `👋 Member Left` })
      .setThumbnail(client.user.displayAvatarURL({ dynamic: true }));

    const welmsg = await channelwelcome
      .send({ embeds: [embedleave] })
      .catch(err);
    welmsg.react("👋");
  }
});

// Welcome Message

client.on(Events.GuildMemberAdd, async (member, err) => {
  const welcomedata = await welcomeschema.findOne({ Guild: member.guild.id });

  if (!welcomedata) return;
  else {
    const channelID = welcomedata.Channel;
    const channelwelcome = member.guild.channels.cache.get(channelID);
    const roledata = await roleschema.findOne({ Guild: member.guild.id });

    if (roledata) {
      const giverole = await member.guild.roles.cache.get(roledata.Role);

      member.roles.add(giverole).catch((err) => {
        console.log("Error received trying to give an auto role!");
      });
    }

    const embedwelcome = new EmbedBuilder()
      .setColor(client.config.embed)
      .setTitle(`${member.user.username} has arrived\nto the Server!`)
      .setDescription(`> Welcome ${member} to the Sevrer!`)
      .setFooter({ text: `👋 Get cozy and enjoy :)` })
      .setTimestamp()
      .setAuthor({ name: `👋 Welcome to the Server!` })
      .setThumbnail(client.user.displayAvatarURL({ dynamic: true }));

    const embedwelcomedm = new EmbedBuilder()
      .setColor(client.config.embed)
      .setTitle("Welcome Message")
      .setDescription(`> Welcome to ${member.guild.name}!`)
      .setFooter({ text: `👋 Get cozy and enjoy :)` })
      .setTimestamp()
      .setAuthor({ name: `👋 Welcome to the Server!` })
      .setThumbnail(client.user.displayAvatarURL({ dynamic: true }));

    const levmsg = await channelwelcome.send({ embeds: [embedwelcome] });
    levmsg.react("👋");
    member
      .send({ embeds: [embedwelcomedm] })
      .catch((err) => console.log(`Welcome DM error: ${err}`));
  }
});

// Verification System
const capschema = require("./Schemas/verify");
const verifyusers = require("./Schemas/verifyusers");

client.on(Events.InteractionCreate, async (interaction) => {
  if (interaction.guild === null) return;

  const verifydata = await capschema.findOne({ Guild: interaction.guild.id });
  const verifyusersdata = await verifyusers.findOne({
    Guild: interaction.guild.id,
    User: interaction.user.id,
  });

  if (interaction.customId === "verify") {
    if (!verifydata)
      return await interaction.reply({
        content: `The **verification system** has been disabled in this server!`,
        ephemeral: true,
      });

    if (verifydata.Verified.includes(interaction.user.id))
      return await interaction.reply({
        content: "You have **already** been verified!",
        ephemeral: true,
      });
    else {
      let letter = [
        "0",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "a",
        "A",
        "b",
        "B",
        "c",
        "C",
        "d",
        "D",
        "e",
        "E",
        "f",
        "F",
        "g",
        "G",
        "h",
        "H",
        "i",
        "I",
        "j",
        "J",
        "f",
        "F",
        "l",
        "L",
        "m",
        "M",
        "n",
        "N",
        "o",
        "O",
        "p",
        "P",
        "q",
        "Q",
        "r",
        "R",
        "s",
        "S",
        "t",
        "T",
        "u",
        "U",
        "v",
        "V",
        "w",
        "W",
        "x",
        "X",
        "y",
        "Y",
        "z",
        "Z",
      ];
      let result = Math.floor(Math.random() * letter.length);
      let result2 = Math.floor(Math.random() * letter.length);
      let result3 = Math.floor(Math.random() * letter.length);
      let result4 = Math.floor(Math.random() * letter.length);
      let result5 = Math.floor(Math.random() * letter.length);

      const cap =
        letter[result] +
        letter[result2] +
        letter[result3] +
        letter[result4] +
        letter[result5];
      console.log(cap);

      const captcha = new CaptchaGenerator()
        .setDimension(150, 450)
        .setCaptcha({ text: `${cap}`, size: 60, color: "red" })
        .setDecoy({ opacity: 0.5 })
        .setTrace({ color: "red" });

      const buffer = captcha.generateSync();

      const verifyattachment = new AttachmentBuilder(buffer, {
        name: `captcha.png`,
      });

      const verifyembed = new EmbedBuilder()
        .setColor(client.config.embed)
        .setAuthor({ name: `✅ Verification Proccess` })
        .setFooter({ text: `✅ Verification Captcha` })
        .setTimestamp()
        .setImage("attachment://captcha.png")
        .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
        .setTitle("> Verification Step: Captcha")
        .addFields({
          name: `• Verify`,
          value: "> Please use the button bellow to \n> submit your captcha!",
        });

      const verifybutton = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setLabel("✅ Enter Captcha")
          .setStyle(ButtonStyle.Success)
          .setCustomId("captchaenter")
      );

      const vermodal = new ModalBuilder()
        .setTitle("Verification")
        .setCustomId("vermodal");

      const answer = new TextInputBuilder()
        .setCustomId("answer")
        .setRequired(true)
        .setLabel("• Please sumbit your Captcha code")
        .setPlaceholder("Your captcha code")
        .setStyle(TextInputStyle.Short);

      const vermodalrow = new ActionRowBuilder().addComponents(answer);
      vermodal.addComponents(vermodalrow);

      const vermsg = await interaction.reply({
        embeds: [verifyembed],
        components: [verifybutton],
        ephemeral: true,
        files: [verifyattachment],
      });

      const vercollector = vermsg.createMessageComponentCollector();

      vercollector.on("collect", async (i) => {
        if (i.customId === "captchaenter") {
          i.showModal(vermodal);
        }
      });

      if (verifyusersdata) {
        await verifyusers.deleteMany({
          Guild: interaction.guild.id,
          User: interaction.user.id,
        });

        await verifyusers.create({
          Guild: interaction.guild.id,
          User: interaction.user.id,
          Key: cap,
        });
      } else {
        await verifyusers.create({
          Guild: interaction.guild.id,
          User: interaction.user.id,
          Key: cap,
        });
      }
    }
  }
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isModalSubmit()) return;

  if (interaction.customId === "vermodal") {
    const userverdata = await verifyusers.findOne({
      Guild: interaction.guild.id,
      User: interaction.user.id,
    });
    const verificationdata = await capschema.findOne({
      Guild: interaction.guild.id,
    });

    if (verificationdata.Verified.includes(interaction.user.id))
      return await interaction.reply({
        content: `You have **already** verified within this server!`,
        ephemeral: true,
      });

    const modalanswer = interaction.fields.getTextInputValue("answer");
    if (modalanswer === userverdata.Key) {
      const verrole = await interaction.guild.roles.cache.get(
        verificationdata.Role
      );

      try {
        await interaction.member.roles.add(verrole);
      } catch (err) {
        return await interaction.reply({
          content: `There was an **issue** giving you the **<@&${verificationdata.Role}>** role, try again later!`,
          ephemeral: true,
        });
      }

      await interaction.reply({
        content: "You have been **verified!**",
        ephemeral: true,
      });
      await capschema.updateOne(
        { Guild: interaction.guild.id },
        { $push: { Verified: interaction.user.id } }
      );
    } else {
      await interaction.reply({
        content: `**Oops!** It looks like you **didn't** enter the valid **captcha code**!`,
        ephemeral: true,
      });
    }
  }
});

// AFK
const afkSchema = require("./Schemas/afkschema");
client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot) return;
  const check = await afkSchema.findOne({
    Guild: message.guild.id,
    User: message.author.id,
  });
  if (check) {
    const nick = check.Nickname;
    await afkSchema.deleteMany({
      Guild: message.guild.id,
      User: message.author.id,
    });

    await message.member.setNickname(`${nick}`).catch((err) => {
      return;
    });

    const m1 = await message.reply({
      content: `Welcome Back, ${message.author}! I have removed your afk`,
      ephemeral: false,
    });
    setTimeout(() => {
      m1.delete();
    }, 5000);
  } else {
    const members = message.mentions.users.first();
    if (!members) return;
    const Data = await afkSchema.findOne({
      Guild: message.guild.id,
      User: members.id,
    });
    if (!Data) return;

    const member = message.guild.members.cache.get(members.id);
    const msg = Data.Message || `No Reason Given`;

    if (message.content.includes(members)) {
      const m = await message.reply({
        content: `${member.user.tag} is currently AFK, don't mention them at this - Reason: **${msg}**`,
      });
      setTimeout(() => {
        m.delete();
      }, 5000);
    }
  }
});

// Anti Ghost Ping
const ghostSchema = require("./Schemas/ghostpingSchema");
const numSchema = require("./Schemas/ghostNum");

client.on(Events.MessageDelete, async (message) => {
  if (message.guild === null) return;
  const Data = await ghostSchema.findOne({ Guild: message.guild.id });
  if (!Data) return;

  if (!message.author) return;
  if (message.author.bot) return;
  if (!message.author.id === client.user.id) return;
  if (message.author === message.mentions.users.first()) return;

  if (message.mentions.users.first() || message.type === MessageType.reply) {
    let number;
    let time = 15;

    const data = await numSchema.findOne({
      Guild: message.guild.id,
      User: message.author.id,
    });
    if (!data) {
      await numSchema.create({
        Guild: message.guild.id,
        User: message.author.id,
        Number: 1,
      });

      number = 1;
    } else {
      data.Number += 1;
      await data.save();

      number = data.Number;
    }

    if (number == 2) time = 60;
    if (number >= 3) time = 500;

    const msg = await message.channel.send({
      content: `${message.author}, you cannot ghost ping members within this server!`,
    });
    setTimeout(() => msg.delete(), 5000);

    const member = message.member;

    if (
      message.member.permissions.has(PermissionsBitField.Flags.Administrator)
    ) {
      return;
    } else {
      await member.timeout(timeout * 1000, "Ghost Pinging");
      await member
        .send({
          content: `You have been timed out in ${message.guild.name} for ${time} seconds due to ghost pinging members`,
        })
        .catch((err) => {
          return;
        });
    }
  }
});

client.on(Events.MessageCreate, async (message) => {
  const countschema = require("./Schemas/counting");
  if (message.guild === null) return;
  const countdata = await countschema.findOne({ Guild: message.guild.id });
  let reaction = "";

  if (!countdata) return;

  let countchannel = client.channels.cache.get(countdata.Channel);
  if (!countchannel) return;
  if (!message.guild) return;
  if (message.author.bot) return;
  if (message.channel.id !== countchannel.id) return;

  if (countdata.Count > 98) {
    reaction = "✔️";
  } else if (countdata.Count > 48) {
    reaction = "☑️";
  } else {
    reaction = "✅";
  }

  if (message.author.id === countdata.LastUser) {
    message.reply({
      content: `You **cannot** count alone! You **messed up** the counter at **${countdata.Count}**! Back to **0**.`,
    });
    countdata.Count = 0;
    countdata.LastUser = " ";

    try {
      message.react("❌");
    } catch (err) {}
  } else {
    if (
      message.content - 1 < countdata.Count &&
      countdata.Count === 0 &&
      message.author.id !== countdata.LastUser
    ) {
      message.reply({ content: `The **counter** is at **0** by default!` });
      message.react("⚠");
    } else if (
      message.content - 1 < countdata.Count ||
      message.content === countdata.Count ||
      (message.content > countdata.Count + 1 &&
        message.author.id !== countdata.LastUser)
    ) {
      message.reply({
        content: `You **messed up** the counter at **${countdata.Count}**! Back to **0**.`,
      });
      countdata.Count = 0;

      try {
        message.react("❌");
      } catch (err) {}
    } else if (
      message.content - 1 === countdata.Count &&
      message.author.id !== countdata.LastUser
    ) {
      countdata.Count += 1;

      try {
        message.react(`${reaction}`);
      } catch (err) {}

      countdata.LastUser = message.author.id;
    }
  }

  countdata.save();
});

// Join-Ping
const pingschema = require("./Schemas/joinping");
client.on(Events.GuildMemberAdd, async (member, err) => {
  const pingdata = await pingschema.findOne({ Guild: member.guild.id });

  if (!pingdata) return;
  else {
    await Promise.all(
      pingdata.Channel.map(async (data) => {
        const pingchannels = await client.channels.fetch(data);
        const message = await pingchannels.send(`${member}`).catch(err);

        setTimeout(() => {
          try {
            message.delete();
          } catch (err) {
            return;
          }
        }, 1000);
      })
    );
  }
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction) return;
  if (!interaction.isChatInputCommand()) return;
  else {
    const channel = await client.channels.cache.get("1105511611160072264");
    const server = interaction.guild.name;
    const user = interaction.user.tag;
    const userId = interaction.user.id;

    const embed = new EmbedBuilder()
      .setColor("Random")
      .setTitle(`⚠️ Chat Command Used!`)
      .addFields({ name: `Server Name`, value: `${server}` })
      .addFields({ name: `Chat Command`, value: `${interaction}` })
      .addFields({ name: `User`, value: `${user} / ${userId}` })
      .setTimestamp()
      .setFooter({ text: `Chat Command Executed` });

    await channel.send({ embeds: [embed] });
  }
});

// MODMAIL CODE //
const modschema = require("./Schemas/modmailschema");
const moduses = require("./Schemas/modmailuses");

client.on(Events.MessageCreate, async (message) => {
  if (message.guild) return;
  if (message.author.id === client.user.id) return;

  const usesdata = await moduses.findOne({ User: message.author.id });

  if (!usesdata) {
    message.react("👋");

    const modselect = new EmbedBuilder()
      .setColor(client.config.embed)
      .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
      .setAuthor({ name: `📫 Modmail System` })
      .setFooter({ text: `📫 Modmail Selecion` })
      .setTimestamp()
      .setTitle("> Select a Server")
      .addFields({
        name: `• Select a Modmail`,
        value: `> Please submit the Server's ID you are \n> trying to connect to in the modal displayed when \n> pressing the button bellow!`,
      })
      .addFields({
        name: `• How do I get the server's ID?`,
        value: `> To get the Server's ID you will have to enable \n> Developer Mode through the Discord settings, then \n> you can get the Server's ID by right \n> clicking the Server's icon and pressing "Copy Server ID".`,
      });

    const button = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("selectmodmail")
        .setLabel("• Select your Server")
        .setStyle(ButtonStyle.Secondary)
    );

    const msg = await message.reply({
      embeds: [modselect],
      components: [button],
    });
    const selectcollector = msg.createMessageComponentCollector();

    selectcollector.on("collect", async (i) => {
      if (i.customId === "selectmodmail") {
        const selectmodal = new ModalBuilder()
          .setTitle("• Modmail Selector")
          .setCustomId("selectmodmailmodal");

        const serverid = new TextInputBuilder()
          .setCustomId("modalserver")
          .setRequired(true)
          .setLabel("• What server do you want to connect to?")
          .setPlaceholder('Example: "1010869461059911681"')
          .setStyle(TextInputStyle.Short);

        const subject = new TextInputBuilder()
          .setCustomId("subject")
          .setRequired(true)
          .setLabel(`• What's the reason for contacting us?`)
          .setPlaceholder(
            `Example: "I wanted to bake some cookies, but someone didn't let me!!!"`
          )
          .setStyle(TextInputStyle.Paragraph);

        const serveridrow = new ActionRowBuilder().addComponents(serverid);
        const subjectrow = new ActionRowBuilder().addComponents(subject);

        selectmodal.addComponents(serveridrow, subjectrow);

        i.showModal(selectmodal);
      }
    });
  } else {
    if (message.author.bot) return;

    const sendchannel = await client.channels.cache.get(usesdata.Channel);
    if (!sendchannel) {
      message.react("⚠");
      await message.reply(
        "**Oops!** Your **modmail** seems **corrupted**, we have **closed** it for you."
      );
      return await moduses.deleteMany({ User: usesdata.User });
    } else {
      const msgembed = new EmbedBuilder()
        .setColor(client.config.embed)
        .setAuthor({
          name: `${message.author.username}`,
          iconURL: `${message.author.displayAvatarURL()}`,
        })
        .setFooter({ text: `📫 Modmail Message - ${message.author.id}` })
        .setTimestamp()
        .setDescription(`${message.content || `**No message provided.**`}`);

      if (message.attachments.size > 0) {
        try {
          msgembed.setImage(`${message.attachments.first()?.url}`);
        } catch (err) {
          return message.react("❌");
        }
      }

      const user = await sendchannel.guild.members.cache.get(usesdata.User);
      if (!user) {
        message.react("⚠️");
        message.reply(
          `⚠️ You have left **${sendchannel.guild.name}**, your **modmail** was **closed**!`
        );
        sendchannel.send(
          `⚠️ <@${message.author.id}> left, this **modmail** has been **closed**.`
        );
        return await moduses.deleteMany({ User: usesdata.User });
      }

      try {
        await sendchannel.send({ embeds: [msgembed] });
      } catch (err) {
        return message.react("❌");
      }

      message.react("📧");
    }
  }
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isModalSubmit()) return;

  if (interaction.customId === "selectmodmailmodal") {
    const data = await moduses.findOne({ User: interaction.user.id });
    if (data)
      return await interaction.reply({
        content: `You have **already** opened a **modmail**! \n> Do **/modmail close** to close it.`,
        ephemeral: true,
      });
    else {
      const serverid = interaction.fields.getTextInputValue("modalserver");
      const subject = interaction.fields.getTextInputValue("subject");

      const server = await client.guilds.cache.get(serverid);
      if (!server)
        return await interaction.reply({
          content: `**Oops!** It seems like that **server** does not **exist**, or I am **not** in it!`,
          ephemeral: true,
        });

      const executor = await server.members.cache.get(interaction.user.id);
      if (!executor)
        return await interaction.reply({
          content: `You **must** be a member of **${server.name}** in order to **open** a **modmail** there!`,
          ephemeral: true,
        });

      const modmaildata = await modschema.findOne({ Guild: server.id });
      if (!modmaildata)
        return await interaction.reply({
          content: `Specified server has their **modmail** system **disabled**!`,
          ephemeral: true,
        });

      const channel = await server.channels
        .create({
          name: `modmail-${interaction.user.id}`,
          parent: modmaildata.Category,
        })
        .catch((err) => {
          return interaction.reply({
            content: `I **couldn't** create your **modmail** in **${server.name}**!`,
            ephemeral: true,
          });
        });

      await channel.permissionOverwrites.create(channel.guild.roles.everyone, {
        ViewChannel: false,
      });

      const embed = new EmbedBuilder()
        .setColor(client.config.embed)
        .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
        .setAuthor({ name: `📫 Modmail System` })
        .setFooter({ text: `📫 Modmail Opened` })
        .setTimestamp()
        .setTitle(`> ${interaction.user.username}'s Modmail`)
        .addFields({ name: `• Subject`, value: `> ${subject}` });

      const buttons = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("deletemodmail")
          .setEmoji("❌")
          .setLabel("Delete")
          .setStyle(ButtonStyle.Secondary),

        new ButtonBuilder()
          .setCustomId("closemodmail")
          .setEmoji("🔒")
          .setLabel("Close")
          .setStyle(ButtonStyle.Secondary)
      );

      await moduses.create({
        Guild: server.id,
        User: interaction.user.id,
        Channel: channel.id,
      });

      await interaction.reply({
        content: `Your **modmail** has been opened in **${server.name}**!`,
        ephemeral: true,
      });
      const channelmsg = await channel.send({
        embeds: [embed],
        components: [buttons],
      });
      channelmsg.createMessageComponentCollector();
    }
  }
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (interaction.customId === "deletemodmail") {
    const closeembed = new EmbedBuilder()
      .setColor(client.config.embed)
      .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
      .setAuthor({ name: `📫 Modmail System` })
      .setFooter({ text: `📫 Modmail Closed` })
      .setTimestamp()
      .setTitle("> Your modmail was Closed")
      .addFields({ name: `• Server`, value: `> ${interaction.guild.name}` });

    const delchannel = await interaction.guild.channels.cache.get(
      interaction.channel.id
    );
    const userdata = await moduses.findOne({ Channel: delchannel.id });

    await delchannel.send("❌ **Deleting** this **modmail**..");

    setTimeout(async () => {
      if (userdata) {
        const executor = await interaction.guild.members.cache.get(
          userdata.User
        );
        if (executor) {
          await executor.send({ embeds: [closeembed] });
          await moduses.deleteMany({ User: userdata.User });
        }
      }

      try {
        await delchannel.delete();
      } catch (err) {
        return;
      }
    }, 100);
  }

  if (interaction.customId === "closemodmail") {
    const closeembed = new EmbedBuilder()
      .setColor(client.config.embed)
      .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
      .setAuthor({ name: `📫 Modmail System` })
      .setFooter({ text: `📫 Modmail Closed` })
      .setTimestamp()
      .setTitle("> Your modmail was Closed")
      .addFields({ name: `• Server`, value: `> ${interaction.guild.name}` });

    const clchannel = await interaction.guild.channels.cache.get(
      interaction.channel.id
    );
    const userdata = await moduses.findOne({ Channel: clchannel.id });

    if (!userdata)
      return await interaction.reply({
        content: `🔒 You have **already** closed this **modmail**.`,
        ephemeral: true,
      });

    await interaction.reply("🔒 **Closing** this **modmail**..");

    setTimeout(async () => {
      const executor = await interaction.guild.members.cache.get(userdata.User);
      if (executor) {
        try {
          await executor.send({ embeds: [closeembed] });
        } catch (err) {
          return;
        }
      }

      interaction.editReply(
        `🔒 **Closed!** <@${userdata.User}> can **no longer** view this **modmail**, but you can!`
      );

      await moduses.deleteMany({ User: userdata.User });
    }, 100);
  }
});

client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot) return;
  if (!message.guild) return;

  const data = await modschema.findOne({ Guild: message.guild.id });
  if (!data) return;

  const sendchanneldata = await moduses.findOne({
    Channel: message.channel.id,
  });
  if (!sendchanneldata) return;

  const sendchannel = await message.guild.channels.cache.get(
    sendchanneldata.Channel
  );
  const member = await message.guild.members.cache.get(sendchanneldata.User);
  if (!member)
    return await message.reply(
      `⚠ <@${sendchanneldata.User} is **not** in your **server**!`
    );

  const msgembed = new EmbedBuilder()
    .setColor(client.config.embed)
    .setAuthor({
      name: `${message.author.username}`,
      iconURL: `${message.author.displayAvatarURL()}`,
    })
    .setFooter({ text: `📫 Modmail Received - ${message.author.id}` })
    .setTimestamp()
    .setDescription(`${message.content || `**No message provided.**`}`);

  if (message.attachments.size > 0) {
    try {
      msgembed.setImage(`${message.attachments.first()?.url}`);
    } catch (err) {
      return message.react("❌");
    }
  }

  try {
    await member.send({ embeds: [msgembed] });
  } catch (err) {
    message.reply(`⚠ I **couldn't** message **<@${sendchanneldata.User}>**!`);
    return message.react("❌");
  }

  message.react("📧");
});

// Auto Response
const schema = require("./Schemas/autoresponder");
client.on("messageCreate", async (message) => {
  const data = await schema.findOne({ guildId: message.guild.id });
  if (!data) return;
  if (message.author.bot) return;

  const msg = message.content;

  for (const d of data.autoresponses) {
    const trigger = d.trigger;
    const response = d.response;

    if (msg === trigger) {
      message.reply(response);
      break;
    }
  }
});

module.exports = client;
