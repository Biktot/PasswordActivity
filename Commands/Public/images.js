const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const axios = require("axios").default;

module.exports = {
  data: new SlashCommandBuilder()
    .setName(`images`)
    .setDescription(`This is a subcommand images`)
    .addSubcommand((command) =>
      command.setName(`cat`).setDescription(`Get a random cat image`)
    )
    .addSubcommand((command) =>
      command.setName(`dog`).setDescription(`Generates a random dog image`)
    )
    .addSubcommand((command) =>
      command
        .setName(`fake-tweet`)
        .setDescription(`Post a real tweet 🐦`)
        .addStringOption((option) =>
          option
            .setName("tweet")
            .setDescription("Enter your tweet")
            .setRequired(true)
        )
    )
    .addSubcommand((command) =>
      command
        .setName(`fake-ytcomment`)
        .setDescription(`Post a real youtube comment 🔴`)
        .addStringOption((option) =>
          option
            .setName("comment")
            .setDescription("Enter your comment")
            .setRequired(true)
        )
    )
    .addSubcommand((command) =>
      command.setName(`meme`).setDescription(`Generates a meme image 😜`)
    )
    .addSubcommand((command) =>
      command
        .setName(`jail`)
        .setDescription(`Get a jail form of a user's avatar, easy as that.`)
        .addUserOption((option) =>
          option.setName("user").setDescription("Select a user")
        )
    )
    .addSubcommand((command) =>
      command
        .setName(`comrade`)
        .setDescription(`Get a conrade form of a user's avatar.`)
        .addUserOption((option) =>
          option.setName("user").setDescription("Select a user")
        )
    )
    .addSubcommand((command) =>
      command
        .setName(`gay`)
        .setDescription(`Get a gay form of a user's avatar.`)
        .addUserOption((option) =>
          option.setName("user").setDescription("Select a user")
        )
    )
    .addSubcommand((command) =>
      command
        .setName(`pixelate`)
        .setDescription(`Get a pixelated form of a user's avatar.`)
        .addUserOption((option) =>
          option.setName("user").setDescription("Select a user")
        )
    )
    .addSubcommand((command) =>
      command
        .setName(`passed`)
        .setDescription(`Get a gta passed form of a user's avatar.`)
        .addUserOption((option) =>
          option.setName("user").setDescription("Select a user")
        )
    )
    .addSubcommand((command) =>
      command
        .setName(`wasted`)
        .setDescription(`Get a gta wasted form of a user's avatar.`)
        .addUserOption((option) =>
          option.setName("user").setDescription("Select a user")
        )
    )
    .addSubcommand((command) =>
      command
        .setName(`triggered`)
        .setDescription(`Get a triggered form of a user's avatar.`)
        .addUserOption((option) =>
          option.setName("user").setDescription("Select a user")
        )
    )
    .addSubcommand((command) =>
      command
        .setName(`circle-crop`)
        .setDescription(`Get a circle cropped form of a user's avatar.`)
        .addUserOption((option) =>
          option.setName("user").setDescription("Select a user")
        )
    )
    .addSubcommand((command) =>
      command
        .setName(`glass`)
        .setDescription(`Get a glass form of a user's avatar.`)
        .addUserOption((option) =>
          option.setName("user").setDescription("Select a user")
        )
    ),
  async execute(interaction, client) {
    const command = interaction.options.getSubcommand();

    // Cat
    switch (command) {
      case "cat":
        try {
          const response = await axios.get(
            "https://api.thecatapi.com/v1/images/search"
          );
          const imageUrl = response.data[0].url;

          const catEmbed = new EmbedBuilder()
            .setColor(client.config.embed)
            .setTitle("Random Cat Image")
            .setImage(imageUrl);
          //.setFooter('Powered by The Cat API');

          await interaction.reply({
            embeds: [catEmbed],
          });
        } catch (error) {
          console.error(error);
          await interaction.reply(
            "Sorry, there was an error getting the cat image."
          );
        }
    }

    // Dog
    switch (command) {
      case "dog":
        try {
          const response = await axios.get(
            "https://dog.ceo/api/breeds/image/random"
          );
          const imageUrl = response.data.message;

          const embed = new EmbedBuilder()
            .setTitle("🐶 Random Dog")
            .setColor(client.config.embed)
            .setImage(imageUrl);

          await interaction.reply({ embeds: [embed] });
        } catch (error) {
          console.error(error);
          await interaction.reply(
            "Sorry, there was an error generating a random dog image."
          );
        }
    }

    // Jail
    switch (command) {
      case "jail":
        const { options, user } = interaction;

        let target = options.getUser("user") || user;

        let avatarUrl = target.avatarURL({ size: 512, extension: "jpg" });
        let canvas = `https://some-random-api.com/canvas/jail?avatar=${avatarUrl}`;

        await interaction.reply({
          content: canvas,
        });
    }

    // Gay
    switch (command) {
      case "gay":
        const { options, user } = interaction;

        let target = options.getUser("user") || user;

        let avatarUrl = target.avatarURL({ size: 512, extension: "jpg" });
        let canvas = `https://some-random-api.com/canvas/gay?avatar=${avatarUrl}`;

        await interaction.reply({
          content: canvas,
        });
    }

    // Glass
    switch (command) {
      case "glass":
        const { options, user } = interaction;

        let target = options.getUser("user") || user;

        let avatarUrl = target.avatarURL({ size: 512, extension: "jpg" });
        let canvas = `https://some-random-api.com/canvas/glass?avatar=${avatarUrl}`;

        await interaction.reply({
          content: canvas,
        });
    }

    // Fake Tweet
    switch (command) {
      case "fake-tweet":
        let tweet = interaction.options.getString("tweet");
        let avatarUrl = interaction.user.avatarURL({ extension: "jpg" });
        let canvas = `https://some-random-api.com/canvas/tweet?avatar=${avatarUrl}&displayname=${
          interaction.user.username
        }&username=${interaction.user.username}&comment=${encodeURIComponent(
          tweet
        )}`;

        const embed = new EmbedBuilder()
          .setTitle("🐦・Fake Tweet!")
          .setImage(canvas)
          .setTimestamp()
          .setColor(client.config.embed);

        await interaction.reply({
          embeds: [embed],
        });
    }

    // Pixelated
    switch (command) {
      case "pixelate":
        const { options, user } = interaction;

        let target = options.getUser("user") || user;

        let avatarUrl = target.avatarURL({ size: 512, extension: "jpg" });
        let canvas = `https://some-random-api.com/canvas/pixelate?avatar=${avatarUrl}`;

        await interaction.reply({
          content: canvas,
        });
    }

    // Circle Crop
    switch (command) {
      case "circle-crop":
        const { options, user } = interaction;

        let target = options.getUser("user") || user;

        let avatarUrl = target.avatarURL({ size: 512, extension: "jpg" });
        let canvas = `https://some-random-api.com/canvas/circle?avatar=${avatarUrl}`;

        await interaction.reply({
          content: canvas,
        });
    }

    // YT-Comment
    switch (command) {
      case "fake-ytcomment":
        let comment = interaction.options.getString("comment");
        let avatarUrl = interaction.user.avatarURL({ extension: "jpg" });
        let canvas = `https://some-random-api.com/canvas/youtube-comment?avatar=${avatarUrl}&displayname=${
          interaction.user.username
        }&username=${interaction.user.username}&comment=${encodeURIComponent(
          comment
        )}`;

        const embed = new EmbedBuilder()
          .setTitle("🔴・Fake comment!")
          .setImage(canvas)
          .setTimestamp()
          .setColor(client.config.embed);

        await interaction.reply({
          embeds: [embed],
        });
    }

    // Triggered
    switch (command) {
      case "triggered":
        const { options, user } = interaction;

        let target = options.getUser("user") || user;

        let avatarUrl = target.avatarURL({ size: 512, extension: "jpg" });
        let canvas = `https://some-random-api.com/canvas/triggered?avatar=${avatarUrl}`;

        await interaction.reply({
          content: canvas,
        });
    }

    // Comarade
    switch (command) {
      case "comrade":
        const { options, user } = interaction;

        let target = options.getUser("user") || user;

        let avatarUrl = target.avatarURL({ size: 512, extension: "jpg" });
        let canvas = `https://some-random-api.com/canvas/comrade?avatar=${avatarUrl}`;

        await interaction.reply({
          content: canvas,
        });
    }

    // Passed
    switch (command) {
      case "passed":
        const { options, user } = interaction;

        let target = options.getUser("user") || user;

        let avatarUrl = target.avatarURL({ size: 512, extension: "jpg" });
        let canvas = `https://some-random-api.com/canvas/passed?avatar=${avatarUrl}`;

        await interaction.reply({
          content: canvas,
        });
    }

    // Wasted
    switch (command) {
      case "wasted":
        const { options, user } = interaction;

        let target = options.getUser("user") || user;

        let avatarUrl = target.avatarURL({ size: 512, extension: "jpg" });
        let canvas = `https://some-random-api.com/canvas/wasted?avatar=${avatarUrl}`;

        await interaction.reply({
          content: canvas,
        });
    }

    // Meme
    switch (command) {
      case "meme":
        async function meme() {
          await fetch(`https://www.reddit.com/r/memes/random/.json`).then(
            async (r) => {
              let meme = await r.json();

              let title = meme[0].data.children[0].data.title;
              let image = meme[0].data.children[0].data.url;
              let author = meme[0].data.children[0].data.author;

              // Embed
              const embed = new EmbedBuilder()
                .setColor(client.config.embed)
                .setTitle(`${title}`)
                .setImage(`${image}`)
                .setURL(`${image}`)
                .setFooter({ text: author });

              await interaction.reply({ embeds: [embed] });
            }
          );
        }

        meme();
    }
  },
};
