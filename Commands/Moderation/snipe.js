const { SlashCommandBuilder } = require(`@discordjs/builders`);
const { EmbedBuilder } = require(`discord.js`);
 
module.exports = {
    data: new SlashCommandBuilder()
    .setName("snipe")
    .setDescription(`Snipes the last deleted message in the channel.`),
    async execute (interaction, client) {
 
        const msg = client.snipes.get(interaction.channel.id);
        if (!msg) return await interaction.reply({ content: "I cant find any deleted messages!", ephemeral: true});
 
        const ID = msg.author.id;
        const member = interaction.guild.members.cache.get(ID)
        const URL = member.displayAvatarURL();
 
        const embed = new EmbedBuilder()
        .setColor(client.config.embed)
        .setTitle(`Sniped Messages! (${member.user.tag})`)
        .setDescription(`${msg.content}`)
        .setTimestamp()
        .setFooter({ text: `Member ID: ${ID}`, iconURL: `${URL}`})
 
        if (msg.image) await interaction.reply({ content: "I cant find any deleted messages!", ephemeral: true})
        await interaction.reply({ embeds: [embed] })
    }
}