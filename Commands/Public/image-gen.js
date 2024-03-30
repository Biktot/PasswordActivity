const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('imagine')
    .setDescription('have AI generate an image!')
    .addStringOption(o => o.setName('prompt').setDescription('the description of the image to generate!').setRequired(true)),

  async execute(interaction, client) {
    await interaction.deferReply();

    const prompt = interaction.options.getString('prompt');
    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        'X-Prodia-Key': client.config.imagegenapi
      },
      body: JSON.stringify({
        prompt: `${prompt}`,
      })
    };

    fetch('https://api.prodia.com/v1/job', options)
      .then(response => response.json())
      .then(jobResponse => {
        const jobId = jobResponse.job;

        const options2 = {
          method: 'GET',
          headers: {
            accept: 'application/json',
            'X-Prodia-Key': client.config.imagegenapi
          }
        };

        setTimeout(() => {
          fetch(`https://api.prodia.com/v1/job/${jobId}`, options2)
            .then(response => response.json())
            .then(async response => {
              const image = response.imageUrl;
              const embed = new EmbedBuilder()
              .setImage(`${image}`)
              .setTitle(`Generated Image!`)
              .setDescription(`> **${prompt}**`)
              .setColor(client.config.embed)
              .setTimestamp()
              await interaction.followUp({embeds: [embed]});
            })
            .catch(err => console.error(err));
        }, 5000);
      })
      .catch(err => console.error(err));
  },
};
