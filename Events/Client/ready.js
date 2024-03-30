const { Client, ActivityType } = require("discord.js");
const { mongoose, connect } = require("mongoose");
const chalk = require("chalk");
const mongo = process.env.mongodb;

function progressBar(progress) {
  const width = 20;
  const percentage = Math.floor((progress / 100) * width);
  const progressBar = `${"=".repeat(percentage)}${" ".repeat(
    width - percentage
  )}`;
  return `[${progressBar}] ${progress}%`;
}

module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    mongoose.set("strictQuery", true);
    console.log(chalk.bold("Connecting to the database..."));

    try {
      let progress = 10;
      const progressUpdateInterval = 20; // Increase to set more frequent updates
      const maxProgress = 100;

      while (progress <= maxProgress) {
        console.log(
          chalk.yellow.bold(`Database Connecting: ${progressBar(progress)}`)
        );
        await new Promise((resolve) => setTimeout(resolve, 500)); // Increased to 0.5 second delay
        progress += progressUpdateInterval;
      }

      await new Promise((resolve) => setTimeout(resolve, 1000)); // Increased to 1 second delay

      mongoose.connection.on("connecting", () => {
        console.log(
          chalk.gray.bold("Database Connection: Attempting to connect...")
        );
      });

      mongoose.connection.on("connected", () => {
        console.log(chalk.green.bold("Database Connection: ✅ Connected"));
      });

      mongoose.connection.on("error", (error) => {
        console.error(
          chalk.red.bold("Error connecting to the database:", error.message)
        );
      });

      mongoose.connection.on("disconnected", () => {
        console.log(chalk.red.bold("Database Connection: ❌ Disconnected"));
      });

      await mongoose.connect(mongo, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });

      if (mongoose.connection.readyState !== 1) {
        console.log(chalk.red.bold("Database Connection: ❌ Weak"));
      }

      // Adding a 1-second delay here before printing "Ence is now online."
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log(
        chalk.blue.bold(`[ Bot ] - ${client.user.username} is now online.`)
      );
    } catch (error) {
      console.error(
        chalk.red.bold("Error connecting to the database:", error.message)
      );
      console.log(chalk.red.bold("[ DB ] - Database Connection: ❌ Failed"));
    }

    let servers = await client.guilds.cache.size;
    let users = await client.guilds.cache.reduce(
      (a, b) => a + b.memberCount,
      0
    );

    let status = [
      {
        name: `$12 Source Code Dm @jarvisplayz`,
        type: ActivityType.Playing,
      },
      {
        name: `/bot info | dsc.gg/syntaxexe`,
        type: ActivityType.Listening,
      },
      {
        name: `/bot invite | ${client.commands.size} Commands`,
        type: ActivityType.Listening,
      },
      {
        name: "Made with 💖 by ItzJarvis",
        type: ActivityType.Playing,
      },
      {
        name: `/help | in ${servers} Servers 🏆`,
        type: ActivityType.Playing,
      },
      {
        name: `/help | with ${formatNumber(users)} Users 👤`,
        type: ActivityType.Watching,
      },
    ];
    setInterval(() => {
      let random = Math.floor(Math.random() * status.length);
      client.user.setActivity(status[random]);
    }, `2000`);
    console.log(chalk.green.bold("[ Bot ] - Sucessfully Enabled Status."));

    function formatNumber(number) {
      if (number >= 1000000) {
        return (number / 1000000).toFixed(1) + "M";
      } else if (number >= 1000) {
        return (number / 1000).toFixed(1) + "K";
      } else {
        return number.toString();
      }
    }
  },
};
