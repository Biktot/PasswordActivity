const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  PermissionsBitField,
  ButtonStyle,
  ChatInputCommandInteraction,
  Client,
} = require("discord.js");
const weather = require("weather-js");
const math = require("mathjs");
const { generatePassword } = require('generate-passwords');
const translate = require("@iamtraction/google-translate");
const BitlyClient = require("bitly").BitlyClient;
const bitly = new BitlyClient("5a760c5f5dbd6b2e66e61e69976c221fd55ead2f");
const Docs = require("discord.js-docs");
const branch = "stable";
const max = 1024;
const replaceDisco = (str) =>
  str
    .replace(/docs\/docs\/disco/g, `docs/discord.js/${branch}`)
    .replace(/ \(disco\)/g, "");
const { ButtonPaginationBuilder } = require("@falloutstudios/djs-pagination");
const { formatNumber, limitString } = require("fallout-utility");

module.exports = {
  data: new SlashCommandBuilder()
    .setName(`tools`)
    .setDescription(`tools desciption`)
    .addSubcommandGroup((group) =>
      group
        .setName(`base64`)
        .setDescription(`Encode or decode command`)
        .addSubcommand((command) =>
          command
            .setName("encode")
            .setDescription("Encode a string to base64")
            .addStringOption((option) =>
              option
                .setName("text")
                .setDescription("The string to encode")
                .setRequired(true)
            )
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName("decode")
            .setDescription("Decode a base64 string")
            .addStringOption((option) =>
              option
                .setName("text")
                .setDescription("The base64 string to decode")
                .setRequired(true)
            )
        )
    )
    .addSubcommand((command) =>
      command
        .setName(`weather`)
        .setDescription(`Gets the weather of a given area.`)
        .addStringOption((option) =>
          option
            .setName("location")
            .setDescription("The location to check the weather of")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("degree-type")
            .setDescription("Select what degree type you would like")
            .addChoices(
              { name: `Fahrenheight`, value: "F" },
              { name: `Celcius`, value: `C` }
            )
            .setRequired(true)
        )
    )
    .addSubcommand((command) =>
      command.setName(`calculator`).setDescription(`A discord calulator.`)
    )
    .addSubcommand((command) =>
      command
        .setName(`password-generator`)
        .setDescription(`Generates a password for you.`)
        .addIntegerOption((option) =>
          option
            .setName("length")
            .setDescription(`Specified length will be your password's length.`)
            .setRequired(true)
            .setMinValue(1)
            .setMaxValue(200)
        )
        .addStringOption((option) =>
          option
            .setName("allow-letters")
            .setDescription(
              "Specify whether you want your password to include letters or not."
            )
            .addChoices(
              { name: `• Allow`, value: "true" },
              { name: `• Disallow`, value: "false" }
            )
        )
        .addStringOption((option) =>
          option
            .setName("allow-numbers")
            .setDescription(
              "Specify whether you want your password to include numbers or not."
            )
            .addChoices(
              { name: `• Allow`, value: "true" },
              { name: `• Disallow`, value: "false" }
            )
        )
        .addStringOption((option) =>
          option
            .setName("allow-symbols")
            .setDescription(
              "Specify whether you want your password to include symbols or not."
            )
            .addChoices(
              { name: `• Allow`, value: "true" },
              { name: `• Disallow`, value: "false" }
            )
        )
        .addStringOption((option) =>
          option
            .setName("upper-only")
            .setDescription(
              "Specify whether you want your password to be upper case only or not."
            )
            .addChoices(
              { name: `• Allow`, value: "true" },
              { name: `• Disallow`, value: "false" }
            )
        )
        .addStringOption((option) =>
          option
            .setName("lower-only")
            .setDescription(
              "Specify whether you want your password to be lower case only or not."
            )
            .addChoices(
              { name: `• Allow`, value: "true" },
              { name: `• Disallow`, value: "false" }
            )
        )
    )
    .addSubcommand((command) =>
      command
        .setName(`docs`)
        .setDescription(`Searches the official Discord.JS documentation.`)
        .addStringOption((option) =>
          option
            .setName("query")
            .setDescription("The search query.")
            .setRequired(true)
        )
    )
    .addSubcommand((command) =>
      command
        .setName(`translate`)
        .setDescription(`Translate any text to a specific language!`)
        .addStringOption((option) =>
          option
            .setName("text")
            .setDescription("The text you wanna translate!")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("language")
            .setDescription("The language you wanna translate to!")
            .addChoices(
              { name: "English", value: "english" },
              { name: "Hindi", value: "hindi" },
              { name: "Turkish", value: "turkish" },
              { name: "Farsi", value: "farsi" },
              { name: "Russian", value: "russian" },
              { name: "Arabic", value: "arabic" }
            )
            .setRequired(true)
        )
    )
    .addSubcommand((command) =>
      command
        .setName(`tts`)
        .setDescription(`Sends text to speech messages in the server`)
        .addStringOption((option) =>
          option
            .setName(`message`)
            .setDescription(`The message you want to send`)
            .setRequired(true)
        )
    )
    .addSubcommand((command) =>
      command
        .setName(`mcstatus`)
        .setDescription(`Tells A Minecraft Server Stats`)
        .addStringOption((option) =>
          option
            .setName(`ip`)
            .setDescription(`The IP address of the server.`)
            .setRequired(true)
        )
    )
    .addSubcommand((command) =>
      command
        .setName(`shorten`)
        .setDescription("Shorten a given link using bitly.")
        .addStringOption((option) =>
          option
            .setName("link")
            .setDescription("Provide a link.")
            .setRequired(true)
        )
    ),
  async execute(interaction, client) {
    const sub = interaction.options.getSubcommand();

    // Password Generator
    let length = await interaction.options.getInteger('length');
        let allowletters = await interaction.options.getString('allow-letters') || false;
        let allownumbers = await interaction.options.getString('allow-numbers') || false;
        let allowsymbols = await interaction.options.getString('allow-symbols') || false;
        let upper = await interaction.options.getString('upper-only')|| false;
        let lower = await interaction.options.getString('lower-only') || false;
 
        let finnalallowletters = false
        if (allowletters !== false && allowletters !== 'false' ) {
            finnalallowletters = true
        }
 
        let finnalallownumbers = false
        if (allownumbers !== false && allownumbers !== 'false' ) {
            finnalallownumbers = true
        }
 
        let finnalallowsymbols = false
        if (allowsymbols !== false && allowsymbols !== 'false') {
            finnalallowsymbols = true
        }
 
        let finnalupper = false;
        if (upper !== false && upper !== 'false') {
            finnalupper = true
        }
 
        let finnallower = false;
        if (lower !== false && lower !== 'false') {
            finnallower = true;
        }
 
        if (finnalallowletters === false && finnalallownumbers === false && finnalallowsymbols === false) return await interaction.reply({ content: `You must specify **atleast** 1 type of **character** to generate a **password**!`, ephemeral: true });
 
        const data = await generatePassword({ length: length, letters: finnalallowletters, numbers: finnalallownumbers, symbols: finnalallowsymbols, upperOnly: finnalupper, lowerOnly: finnallower});
 
        const embed = new EmbedBuilder()
        .setTitle(`> Password Generated`)
        .setAuthor({ name: `🔑 Password Generator`})
        .setFooter({ text: `🔑 Password Generated`})
        .addFields({ name: `• Password`, value: `> ||\`\`\`${data}\`\`\`||`})
        .setColor(client.config.embed)
 
        await interaction.reply({ embeds: [embed], ephemeral: true });

    // Mc Status
    switch (sub) {
      case "mcstatus":
        const ip = interaction.options.getString(`ip`);
        const url = `https://api.mcsrvstat.us/1/${ip}`;

        const errEmbed = new EmbedBuilder()
          .setColor("Red")
          .setTitle("Error: Unable to access server status.")
          .setDescription(
            `The server is either offline or its a bedrock server or the IP provided is wrong.`
          );

        try {
          const data = await fetch(url).then((response) => response.json());
          const serverip = data.hostname;
          const realip = data.ip;
          const port = data.port;
          const version = data.version;
          const onlineplayers = data.players.online;
          const maxplayers = data.players.max;
          const motd = data.motd.clean;

          const embed = new EmbedBuilder()
            .setColor(client.config.embed)
            .addFields(
              { name: "Server", value: serverip },
              { name: "IP Address", value: `${realip}`, inline: true },
              { name: "Port", value: `${port}`, inline: true },
              { name: "Version", value: version.toString() },
              { name: "MOTD", value: motd.toString() },
              {
                name: "Online Players",
                value: onlineplayers.toString(),
                inline: true,
              },
              {
                name: "Max Players",
                value: maxplayers.toString(),
                inline: true,
              }
            );
          await interaction.reply({ embeds: [embed] });
        } catch (error) {
          interaction.reply({ embeds: [errEmbed], ephemeral: true });
        }
    }

    // Base 64
    switch (sub) {
      case "encode":
        const text = interaction.options.getString("text");
        const encoded = Buffer.from(text).toString("base64");

        const embed = new EmbedBuilder()
          .setTitle("Base64 Encode")
          .addFields({ name: "Input", value: `\`\`\`${text}\`\`\`` })
          .addFields({ name: "Output", value: `\`\`\`${encoded}\`\`\`` })
          .setColor(client.config.embed);

        await interaction.reply({ embeds: [embed] });
    }
    switch (sub) {
      case "decode":
        const base64 = interaction.options.getString("text");
        const decoded = Buffer.from(base64, "base64").toString();

        const embed2 = new EmbedBuilder()
          .setTitle("Base64 Decode")
          .addFields({ name: "Input", value: `\`\`\`${base64}\`\`\`` })
          .addFields({ name: "Output", value: `\`\`\`${decoded}\`\`\`` })
          .setColor(client.config.embed);

        await interaction.reply({ embeds: [embed2] });
    }

    // Weather
    switch (sub) {
      case "weather":
        const { options } = interaction;
        const location = options.getString("location");
        const degree = options.getString("degree-type");

        await interaction.reply({
          content: `<a:loading:1088346989160321044> Gathering your wheather data...`,
        });

        await weather.find(
          { search: `${location}`, degreeType: `${degree}` },
          async function (err, result) {
            setTimeout(() => {
              if (err) {
                console.log(err);
                interaction.editReply({
                  content: `${err} | Because we are pulling data, sometimes timeouts happen! Try this command again`,
                });
              } else {
                const temp = result[0].current.temperature;
                const type = result[0].current.skytext;
                const name = result[0].location.name;
                const feel = result[0].current.feelslike;
                const icon = result[0].current.imageUrl;
                const wind = result[0].current.winddisplay;
                const day = result[0].current.day;
                const alert = result[0].location.alert || "None";

                const embed = new EmbedBuilder()
                  .setColor(client.config.embed)
                  .setTitle(`Current weather of ${name}`)
                  .addFields({ name: `Temperature`, value: `${temp}` })
                  .addFields({ name: `Feels Like`, value: `${feel}` })
                  .addFields({ name: `Weather`, value: `${type}` })
                  .addFields({ name: `Current Alerts`, value: `${alert}` })
                  .addFields({ name: `Week Day`, value: `${day}` })
                  .addFields({
                    name: `Wind Speed & Direction`,
                    value: `${wind}`,
                  })
                  .setThumbnail(icon);

                interaction.editReply({ content: ``, embeds: [embed] });
              }
            });
          }
        );
    }

    // Docs
    switch (sub) {
      case "docs":
        const query = interaction.options.getString("query");
        const doc = await Docs.fetch(branch);
        const results = await doc.resolveEmbed(query);

        if (!results) {
          return interaction.reply("Could not find that documentation.");
        }

        const string = replaceDisco(JSON.stringify(results));
        const embed = JSON.parse(string);

        embed.author.url = `https://discord.js.org/#/docs/discord.js/${branch}/general/welcome`;

        const match =
          /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/.exec(
            embed.description
          );
        const extra = match
          ? "\n\nView more here: " + match[0].split(")")[0]
          : "";

        for (const field of embed.fields || []) {
          if (field.value.length >= max) {
            field.value = field.value.slice(0, max);
            const split = field.value.split(" ");
            let joined = split.join(" ");

            while (joined.length >= max - extra.length) {
              split.pop();
              joined = split.join(" ");
            }

            field.value = joined + extra;
          }
        }

        if (
          embed.fields &&
          embed.fields[embed.fields.length - 1].value.startsWith("[View source")
        ) {
          embed.fields.pop();
        }

        return interaction.reply({ embeds: [embed] });
    }
    // Calculator
    switch (sub) {
      case "calculator":
        const idPrefix = "calulator";
        const embed = new EmbedBuilder()
          .setDescription("```\nResults are shown here\n```")
          .setColor("Blurple");
        const row = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setLabel("Clear")
            .setCustomId(idPrefix + "_clear")
            .setStyle(ButtonStyle.Danger),
          new ButtonBuilder()
            .setLabel("(")
            .setCustomId(idPrefix + "_(")
            .setStyle(ButtonStyle.Primary),
          new ButtonBuilder()
            .setLabel(")")
            .setCustomId(idPrefix + "_)")
            .setStyle(ButtonStyle.Primary),
          new ButtonBuilder()
            .setLabel("<=")
            .setCustomId(idPrefix + "_backspace")
            .setStyle(ButtonStyle.Primary)
        );
        const row1 = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setLabel("1")
            .setCustomId(idPrefix + "_1")
            .setStyle(ButtonStyle.Secondary),
          new ButtonBuilder()
            .setLabel("2")
            .setCustomId(idPrefix + "_2")
            .setStyle(ButtonStyle.Secondary),
          new ButtonBuilder()
            .setLabel("3")
            .setCustomId(idPrefix + "_3")
            .setStyle(ButtonStyle.Secondary),
          new ButtonBuilder()
            .setLabel("/")
            .setCustomId(idPrefix + "_/")
            .setStyle(ButtonStyle.Primary)
        );
        const row2 = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setLabel("4")
            .setCustomId(idPrefix + "_4")
            .setStyle(ButtonStyle.Secondary),
          new ButtonBuilder()
            .setLabel("5")
            .setCustomId(idPrefix + "_5")
            .setStyle(ButtonStyle.Secondary),
          new ButtonBuilder()
            .setLabel("6")
            .setCustomId(idPrefix + "_6")
            .setStyle(ButtonStyle.Secondary),
          new ButtonBuilder()
            .setLabel("*")
            .setCustomId(idPrefix + "_*")
            .setStyle(ButtonStyle.Primary)
        );
        const row3 = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setLabel("7")
            .setCustomId(idPrefix + "_7")
            .setStyle(ButtonStyle.Secondary),
          new ButtonBuilder()
            .setLabel("8")
            .setCustomId(idPrefix + "_8")
            .setStyle(ButtonStyle.Secondary),
          new ButtonBuilder()
            .setLabel("9")
            .setCustomId(idPrefix + "_9")
            .setStyle(ButtonStyle.Secondary),
          new ButtonBuilder()
            .setLabel("-")
            .setCustomId(idPrefix + "_-")
            .setStyle(ButtonStyle.Primary)
        );
        const row4 = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setLabel("0")
            .setCustomId(idPrefix + "_0")
            .setStyle(ButtonStyle.Secondary),
          new ButtonBuilder()
            .setLabel(".")
            .setCustomId(idPrefix + "_.")
            .setStyle(ButtonStyle.Secondary),
          new ButtonBuilder()
            .setLabel("=")
            .setCustomId(idPrefix + "_=")
            .setStyle(ButtonStyle.Success),
          new ButtonBuilder()
            .setLabel("+")
            .setCustomId(idPrefix + "_+")
            .setStyle(ButtonStyle.Primary)
        );

        const msg = await interaction.reply({
          embeds: [embed],
          components: [row, row1, row2, row3, row4],
          ephemeral: false,
        });

        let data = "";
        const col = msg.createMessageComponentCollector({
          filter: (i) => i.user.id === interaction.user.id,
          time: 600000,
        });

        col.on("collect", async (i) => {
          const id = i.customId;
          const value = id.split("_")[1];
          let extra = "";

          if (value === "=") {
            try {
              data = math.evaluate(data).toString();
            } catch (e) {
              data = "";
              extra = "There is an error. Please press AC to restart";
            }
          } else if (value === "clear") {
            data = "";
            extra = "Results are shown here";
          } else if (value === "backspace") {
            //data = data.slice(0, data.length - 2);
            data = data.slice(0, -1);
          } else {
            const lc = data[data.length - 1];

            data +=
              `${
                ((parseInt(value) == value || value === ".") &&
                  (lc == parseInt(lc) || lc === ".")) ||
                data.length === 0
                  ? ""
                  : " "
              }` + value;
          }

          i.update({
            embeds: [
              new EmbedBuilder()
                .setColor("Blurple")
                .setDescription(`\`\`\`\n${data || extra}\n\`\`\``),
            ],
            components: [row, row1, row2, row3, row4],
            ephemeral: false,
          });
        });
    }

    // Shorten
    switch (sub) {
      case "shorten":
        const { options } = interaction;

        let link = options.getString("link");
        const embed = new EmbedBuilder();

        try {
          if (!link.match(/^(http:\/\/.|https:\/\/.|http:\/\/|https:\/\/)/)) {
            link = "https://" + link;
          }
          if (
            link.match(
              /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/
            )
          ) {
            let result;
            try {
              result = await bitly.shorten(link);
            } catch (e) {
              throw e;
            }
            return interaction.reply({
              embeds: [
                embed
                  .setTitle(
                    `${interaction.user.username} - Bitly Link Shortener`
                  )
                  .setDescription(`Old link: ${link}\nNew link: ${result.link}`)
                  .setColor("Orange")
                  .setTimestamp(),
              ],
            });
          } else {
            return interaction.reply({
              embeds: [embed.setColor("Red").setDescription("`INVALID LINK`")],
            });
          }
        } catch (err) {
          console.log(err);
          interaction.reply({
            embeds: [
              embed
                .setColor("Red")
                .setTitle("An error has occured!")
                .setDescription(
                  "Try to add `https://` and `www.` before the link. If the issue persists, please contact the developer."
                ),
            ],
          });
        }
    }

    // tts
    switch (sub) {
      case "tts":
        if (
          !interaction.member.permissions.has(
            PermissionsBitField.Flags.SendTTSMessages
          )
        )
          return await interaction.reply({
            content: `You don't have perms to send tts messages in this server`,
            ephemeral: true,
          });

        const { options } = interaction;
        const message = options.getString("message");

        await interaction.reply({ content: `${message}`, tts: true });
    }

    // Translate
    switch (sub) {
      case "translate":
        const { options } = interaction;
        const text = options.getString("text");
        const language = options.getString("language");

        switch (language) {
          case "english":
            {
              const translated = await translate(text, { to: "en" });
              send_translated(text, translated.text, interaction, client);
            }
            break;

          case "hindi":
            {
              const translated = await translate(text, { to: "hi" });
              send_translated(text, translated.text, interaction, client);
            }
            break;

          case "turkish":
            {
              const translated = await translate(text, { to: "tr" });
              send_translated(text, translated.text, interaction, client);
            }
            break;

          case "farsi":
            {
              const translated = await translate(text, { to: "fa" });
              send_translated(text, translated.text, interaction, client);
            }
            break;

          case "spanish": {
            const translated = await translate(text, { to: "sp" });
            send_translated(text, translated.text, interaction, client);
          }

          case "russian":
            {
              const translated = await translate(text, { to: "ru" });
              send_translated(text, translated.text, interaction, client);
            }
            break;

          case "arabic":
            {
              const translated = await translate(text, { to: "ar" });
              send_translated(text, translated.text, interaction, client);
            }
            break;
        }

        function send_translated(text, translated, interaction, client) {
          const Response = new EmbedBuilder()
            .setColor(client.config.embed)
            .setTitle("🌍 Translator")
            .addFields(
              { name: "Message:", value: text, inline: true },
              { name: "Translated:", value: translated, inline: true }
            )
            .setFooter({
              text: `Requested by ${interaction.member.user.tag}`,
              iconURL: interaction.member.user.displayAvatarURL(),
            });

          interaction.channel.send({ embeds: [Response] });
          interaction.reply({
            content: "Successfully translated message!",
            ephemeral: false,
          });
        }
    }
  },
};
