const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder, ChannelType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("youtube")
    .setDescription(`Manage and recieve notifications from Youtube Channels.`)
    .addSubcommand(subcommand =>
        subcommand.setName(`add`)
            .setDescription("Add a channel to recieve new Youtube video notifications")
            .addStringOption(option =>
                option.setName(`link`)
                    .setDescription(`The link of the channel you want to recieve new Youtube notifications.`)
                    .setRequired(true)
            )
            .addChannelOption(option =>
                option.setName(`channel`)
                .setDescription(`The channel you wish to send the notifications to.`)
                .setRequired(false)
                .addChannelTypes(ChannelType.GuildText)
            )
    )
    .addSubcommand(subcommand =>
        subcommand.setName('remove')
            .setDescription(`Remove an registered channel from the notification list.`)
            .addStringOption(option =>
                option.setName(`link`)
                .setDescription(`The link of the channel you want to stop recieving notifications from.`)
                .setRequired(true)
                )
        
        )
    .addSubcommand(subcommand =>
            subcommand.setName('removeall')
                .setDescription(`Remove all registered channel from the notification list.`)
            )
    .addSubcommand(subcommand =>
            subcommand.setName('latestvideo')
                .setDescription(`Get the latest video from a channel.`)
                .addStringOption(option =>
                    option.setName(`link`)
                    .setDescription(`The link of the channel you want to see the latest video of.`)
                    .setRequired(true)
                    )
            )
    .addSubcommand(subcommand =>
            subcommand.setName('info')
                .setDescription(`Get information about the channel`)
                .addStringOption(option =>
                    option.setName(`link`)
                    .setDescription(`The link of the channel you want to see info of.`)
                    .setRequired(true)
                    )
            ),

    async execute (interaction, client) {
        const {options, guildId} = interaction;

        const sub = options.getSubcommand();
        const link = options.getString('link');
        const channel = options.getChannel('channel') || interaction.channel;

        const embed = new EmbedBuilder();

        try {
            switch (sub) {
                case "add":
                    if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ content: `You don't have perms to setup youtube notification messages in this server`, ephemeral: true })
                    client.ytp.setChannel(link, channel).then(data => {
                        interaction.reply({ 
                            embeds: [embed.setDescription(`Successfully add new channel ${data.YTchannel} to ${channel}`).setColor(client.config.embed).setTimestamp()]
                        });
                    }).catch(err => {
                        console.log(err);
                        return interaction.reply({ embeds: [embed.setColor('Red').setDescription(`The Error Is: \`\`\`yaml\n${err}\`\`\` \nSomething went wrong, please contact developers.`)] });
                    });
                    break;
                case "remove":
                    if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ content: `You don't have perms to delete youtube notification setup in this server`, ephemeral: true })
                    client.ytp.deleteChannel(guildId, link).then(data => {
                        interaction.reply({ 
                            embeds: [embed.setDescription(`Successfully removed channel ${channel} from ${guildId}`).setColor(client.config.embed).setTimestamp()]
                        });
                    }).catch(err => {
                        console.log(err);
                        return interaction.reply({ embeds: [embed.setColor('Red').setDescription("Something went wrong, please contact developers.")] });
                    });
                    break;
                case "removeall":
                    if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ content: `You don't have perms to remove youtube notification setup in this server`, ephemeral: true })
                    client.ytp.deleteAllChannels(guildId).then(data => {
                        interaction.reply({ 
                            embeds: [embed.setDescription(`Successfully deleted all channels in ${guildId}`).setColor(client.config.embed).setTimestamp()]
                        });
                    }).catch(err => {
                        console.log(err);
                        return interaction.reply({ embeds: [embed.setColor('Red').setDescription("Something went wrong, please contact developers.")] });
                    });
                    break;
                case "latestvideo":
                    client.ytp.getLatestVideos(link).then(data => {
                        embed.setTitle(`${data[0].title}`)
                        .setURL(data[0].link)
                        interaction.reply({ embeds: [embed] });
                        return interaction.channel.send({ content: `${data[0].link}` })
                    }).catch(err => {
                        console.log(err);
                        return interaction.reply({ embeds: [embed.setColor('Red').setDescription("Something went wrong, please contact developers.")] });
                    });
                    break;
                case "info":
                    client.ytp.getChannelInfo(link).then(data => {
                        embed.setTitle(data.name)
                        .addFields(
                            { name: "URL:", value: `${data.url}`, inline: true },
                            { name: "Subscribers:", value: `${data.subscribers.split(" ")[0]}`, inline: true },
                            { name: "Description:", value: `${data.description}`, inline: false },
                        )
                        .setImage(data.banner[0].url)
                        .setTimestamp();
                        interaction.reply({ 
                            embeds: [embed]
                        });
                    }).catch(err => {
                        console.log(err);
                        return interaction.reply({ embeds: [embed.setColor('Red').setDescription("Something went wrong, please contact developers.")] });
                    });
                    break;
            }
        } catch (err) {
            console.log(err);
            return interaction.reply({ embeds: [embed.setColor('Red').setDescription("Something went wrong, please contact developers.")] });
        }
    }
}
