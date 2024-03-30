const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
  CommandInteraction,
  PermissionFlagsBits,
  ButtonBuilder,
  ChannelType,
  PermissionsBitField,
  ActionRowBuilder,
  ButtonStyle,
} = require("discord.js");

const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

module.exports = {
  data: new SlashCommandBuilder()
    .setName(`fun`)
    .setDescription(`This is a subcommand fun`)
    .addSubcommand((command) =>
      command.setName(`pp-size`).setDescription(`Shows the size of your pp.`)
    )
    .addSubcommand((command) =>
      command.setName(`advice`).setDescription(`Get a random advice.`)
    )
    .addSubcommand((command) =>
      command.setName(`dice-roll`).setDescription(`Roll a dice. (1~6) 🎲`)
    )
    .addSubcommand((command) =>
      command.setName(`joke`).setDescription(`Get a funny joke 🤣`)
    )
    .addSubcommand((command) =>
      command
        .setName(`kiss`)
        .setDescription(`Kiss a user. 😘`)
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("the user you want to kiss.")
            .setRequired(true)
        )
    )
    .addSubcommand((command) =>
      command.setName(`coin-flip`).setDescription(`Flip a coin.`)
    )
    .addSubcommand((command) =>
      command
        .setName(`slap`)
        .setDescription(`Give the user a slap! 👋`)
        .addUserOption((option) =>
          option
            .setName("target")
            .setDescription("Who do u wanna slap?")
            .setRequired(true)
        )
    ),
  async execute(interaction, client) {
    const command = interaction.options.getSubcommand();

    // Pp
    switch (command) {
      case "pp-size":
        const penisSize = Math.floor(Math.random() * 10) + 1;
        let penismain = "8";
        for (let i = 0; i < penisSize; i++) {
          penismain += "=";
        }

        const penisEmbed = new EmbedBuilder()
          .setColor(client.config.embed)
          .setTitle(`${interaction.user.username}'s Penis Size 😶`)
          .setDescription(`Your penis size is  ${penismain}D`);

        await interaction.reply({ embeds: [penisEmbed] });
    }
    
    // Advice
    switch (command) {
      case "advice":
        const data = await fetch("https://api.adviceslip.com/advice").then(
          (res) => res.json()
        );

        interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription(`**${data.slip.advice}**`)
              .setColor(client.config.embed),
          ],
        });
    }

    // Dice-ROll
    switch (command) {
      case "dice-roll":
        const choices = ["1 ", "2", "3", "4", "5", "6"];
        const randomChoice =
          choices[Math.floor(Math.random() * choices.length)];

        const embed = new EmbedBuilder();

        try {
          switch (randomChoice) {
            case "1":
              embed
                .setTitle("🎲 | Your dice have been rolled...")
                .setColor("Green")
                .setDescription("Your number is **1**!");
              return interaction.reply({ embeds: [embed] });
            case "2":
              embed
                .setTitle("🎲 | Your dice have been rolled...")
                .setColor("Orange")
                .setDescription("Your number is **2**!");
              return interaction.reply({ embeds: [embed] });
            case "3":
              embed
                .setTitle("🎲 | Your dice have been rolled...")
                .setColor(client.config.embed)
                .setDescription("Your number is **3**!");
              return interaction.reply({ embeds: [embed] });
            case "4":
              embed
                .setTitle("🎲 | Your dice have been rolled...")
                .setColor("White")
                .setDescription("Your number is **4**!");
              return interaction.reply({ embeds: [embed] });
            case "5":
              embed
                .setTitle("🎲 | Your dice have been rolled...")
                .setColor("Black")
                .setDescription("Your number is **5**!");
              return interaction.reply({ embeds: [embed] });
            case "6":
              embed
                .setTitle("🎲 | Your dice have been rolled...")
                .setColor("Purple")
                .setDescription("Your number is **6**!");
              return interaction.reply({ embeds: [embed] });
          }
        } catch (err) {
          console.log(err);

          embed.setColor("Red").setDescription("⛔ | Something went wrong...");

          return interaction.reply({ embeds: [embed], ephemeral: true });
        }
    }

    // Joke
    switch (command) {
      case "joke":
        const joke = require("one-liner-joke");
        const { member } = interaction;

        let jEmbed = new EmbedBuilder()
          .setDescription(joke.getRandomJoke().body)
          .setColor(client.config.embed)
          .setTimestamp()
          .setFooter({
            text: `Requested by ${member.user.tag}`,
            iconURL: member.displayAvatarURL(),
          });
        return interaction.reply({ embeds: [jEmbed] });
    }

    // Slap
    switch (command) {
      case "slap":
        const slaps = [
          "https://i.giphy.com/media/3XlEk2RxPS1m8/giphy.gif",
          "https://i.giphy.com/media/mEtSQlxqBtWWA/giphy.gif",
          "https://i.giphy.com/media/j3iGKfXRKlLqw/giphy.gif",
          "https://i.giphy.com/media/2M2RtPm8T2kOQ/giphy.gif",
          "https://i.giphy.com/media/l3YSimA8CV1k41b1u/giphy.gif",
          "https://i.giphy.com/media/WLXO8OZmq0JK8/giphy.gif",
          "https://media1.tenor.com/images/0720ffb69ab479d3a00f2d4ac7e0510c/tenor.gif",
          "https://media1.tenor.com/images/8b80166ce48c9c198951361715a90696/tenor.gif",
          "https://media1.tenor.com/images/6aa432caad8e3272d21a68ead3629853/tenor.gif",
          "https://media1.tenor.com/images/4ec47d7b87a9ce093642fc8a3c2969e7/tenor.gif",
        ];

        const { options, member } = interaction;

        const user = options.getUser("target");

        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(client.config.embed)
              .setImage(slaps[Math.floor(Math.random() * slaps.length)])
              .setDescription(`${member} slapped ${user}!`),
          ],
        });
    }

    // Kiss
    switch (command) {
      case "kiss":
        let user = interaction.options.getUser("user");

        let lista1 = [
          "https://media.tenor.com/jnndDmOm5wMAAAAC/kiss.gif",
          "https://media.tenor.com/dn_KuOESmUYAAAAC/engage-kiss-anime-kiss.gif",
          "https://gifdb.com/images/high/surprising-anime-kiss-togashi-yuuta-q5960hphr79b0rwy.gif",
          "https://www.gifcen.com/wp-content/uploads/2022/03/anime-kiss-gif-5.gif",
          "https://thumbs.gfycat.com/AdeptHelpfulKitty-size_restricted.gif",
        ];

        let lista2 = [
          "https://media0.giphy.com/media/QGc8RgRvMonFm/giphy.gif",
          "https://www.gifcen.com/wp-content/uploads/2022/03/anime-kiss-gif-8.gif",
          "https://i.pinimg.com/originals/13/06/73/1306732d3351afe642c9a7f6d46f548e.gif",
          "https://steamuserimages-a.akamaihd.net/ugc/775102481299732831/2DC63FCFACDE35CEFB3C88B646110B54252489AC/?imw=5000&imh=5000&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false",
          "https://animesher.com/orig/1/157/1572/15720/animesher.com_gif-anime-kiss-1572052.gif",
        ];

        let random1 = lista1[Math.floor(Math.random() * lista1.length)];
        let random2 = lista2[Math.floor(Math.random() * lista2.length)];

        let embed = new EmbedBuilder()
          .setTitle("ℹ️ | INFORMATION")
          .setDescription(`> 😘 **${interaction.user} he kissed ${user}.**`)
          .setImage(`${random1}`)
          .setColor(client.config.embed);

        let button = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("abracar")
            .setLabel("Kiss back")
            .setEmoji("1083183779318874165")
            .setStyle(ButtonStyle.Primary)
            .setDisabled(false)
        );

        let embed1 = new EmbedBuilder()
          .setTitle("ℹ️ | INFORMATION")
          .setDescription(
            `> 😘 **${user} he kissed back ${interaction.user}.**`
          )
          .setColor(client.config.embed)
          .setImage(`${random2}`);

        interaction
          .reply({ embeds: [embed], components: [button] })
          .then(() => {
            const filter = (i) =>
              i.customId === "abracar" && i.user.id === user.id;
            const collector =
              interaction.channel.createMessageComponentCollector({
                filter,
                max: 1,
              });

            collector.on("collect", async (i) => {
              if (i.customId === "abracar") {
                i.reply({ embeds: [embed1] });
              }
            });
          });
    }

    //Coin Flip
    switch (command) {
      case "coin-flip":
        const embedd = new EmbedBuilder()
          .setColor(client.config.embed)
          .setImage(
            "https://media.discordapp.net/attachments/1083650198850523156/1084439687495700551/img_7541.gif?width=1600&height=1200"
          );
        await interaction.reply({ embeds: [embedd], fetchReply: true });

        setTimeout(() => {
          const choices = ["Heads", "Tails"];
          const randomChoice =
            choices[Math.floor(Math.random() * choices.length)];

          const emoji =
            randomChoice === "Heads"
              ? "<:heads:1086210059727548436>"
              : "<:tails:1086210064366448700>";

          const embed = new EmbedBuilder()
            .setColor(client.config.embed)
            .setTitle(`${emoji} Its a ${randomChoice}`);

          interaction.editReply({ embeds: [embed] });
        }, 4000);
    }
  },
};
