const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

module.exports = {
  data: new SlashCommandBuilder()
    .setName('remove-bg')
    .setDescription('Removes the background from an image. ➖')
    .addStringOption(option => 
      option.setName('url')
        .setDescription('The URL of the image to remove the background from')
        .setRequired(true)),
        premiumOnly: true,

  async execute(interaction, client) {
    const url = interaction.options.getString('url');
    const apiKey = 'nLiLbA3aLHDv5QcFV6jFawwy';
    const apiUrl = `https://api.remove.bg/v1.0/removebg?size=auto`;
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'X-Api-Key': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        image_url: url
      })
    });
    const result = await response.buffer();
    const attachmentName = `removedbg.png`;
    const attachmentFile = new AttachmentBuilder(result, attachmentName);
    return interaction.reply({
      content: 'Here is your image with the background removed:',
      files: [attachmentFile]
    });
  }
};