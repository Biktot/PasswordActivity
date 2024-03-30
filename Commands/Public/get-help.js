const {
  EmbedBuilder,
  PermissionsBitField,
  SlashCommandBuilder,
} = require("discord.js");
var timeout = [];
const staffschema = require("../../Schemas/staffrole");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("staff-help")
    .setDescription("Ping for help!"),
  async execute(interaction, client) {
    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.Administrator
      ) &&
      timeout.includes(interaction.member.id) &&
      interaction.user.id !== "536944480469909569"
    )
      return await interaction.reply({
        content: "You are on cooldown! You **cannot** execute /help staff.",
        ephemeral: true,
      });

    const staffdata = await staffschema.findOne({
      Guild: interaction.guild.id,
    });

    if (!staffdata) {
      return await interaction.reply({
        content: `This **feature** has not been **set up** in this server yet!`,
        ephemeral: true,
      });
    } else {
      const staffembed = new EmbedBuilder()
        .setColor(client.config.embed)
        .setTimestamp()
        .setTitle("• Staff team Pinged")
        .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
        .setAuthor({ name: `🛠 Help Staff system` })
        .setFooter({ text: `🛠 Staff Team pinged` })
        .setDescription("> You will be assisted shortly! \n> Sit tight.");

      const staffrole = staffdata.Role;
      const memberslist = await interaction.guild.roles.cache
        .get(staffrole)
        .members.filter((member) => member.presence?.status !== "offline")
        .map((m) => m.user)
        .join("\n> ");

      if (!memberslist) {
        return await interaction.reply({
          content: `There are **no** staff available **at the moment**! Try again later..`,
          ephemeral: true,
        });
      } else {
        await interaction.reply({
          content: `> ${memberslist}`,
          embeds: [staffembed],
        });

        timeout.push(interaction.user.id);
        setTimeout(() => {
          timeout.shift();
        }, 60000);
      }
    }
  },
};
