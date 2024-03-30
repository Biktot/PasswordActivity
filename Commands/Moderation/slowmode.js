const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require(`discord.js`);
 
module.exports = {
    data: new SlashCommandBuilder()
        .setName('slowmode')
        .setDescription('Change the slowmode of a channel')
        .addSubcommand(subcommand => subcommand
            .setName('set')
            .setDescription('Set the slowmode of a channel')
            .addChannelOption(option => option
                .setName('channel')
                .setDescription('The channel to set the slowmode of')
                .addChannelTypes(ChannelType.GuildText)
                .setRequired(true)
            )
            .addIntegerOption(option => option
                .setName('time')
                .setDescription('The time in seconds to set the slowmode of the channel to')
                .setRequired(true)
                .setMinValue(1)
            )
            .addStringOption(option => option
                .setName('timeformat')
                .setDescription('The time format to set the slowmode of the channel to')
                .addChoices(
                    { name: 'Seconds', value: 'seconds' },
                    { name: 'Minutes', value:'minutes' },
                    { name: 'Hours', value: 'hours' },
                    { name: 'Days', value: 'days' },
                    { name: 'Weeks', value: 'weeks' },
                    { name: 'Months', value:'months' },
                )
                .setRequired(true)
            )
        )
        .addSubcommand(subcommand => subcommand
            .setName('disable')
            .setDescription('Disable the slowmode of a channel')
            .addChannelOption(option => option
                .setName('channel')
                .setDescription('The channel to disable the slowmode of')
                .addChannelTypes(ChannelType.GuildText)
                .setRequired(true)
            )
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
        .setDMPermission(false),
 
    async execute(interaction, client) {
 
        // Get the Command Options
        const channel = interaction.options.getChannel('channel');
        const time = interaction.options.getInteger('time');
        const timeformat = interaction.options.getString('timeformat');
 
        // transfer the time to the correct format
        let timeInSeconds = 0;
        switch (timeformat) {
            case'seconds':
                timeInSeconds = time;
                break;
            case'minutes':
                timeInSeconds = time * 60;
                break;
            case 'hours':
                timeInSeconds = time * 60 * 60;
                break;
            case 'days':
                timeInSeconds = time * 60 * 60 * 24;
                break;
            case 'weeks':
                timeInSeconds = time * 60 * 60 * 24 * 7;
                break;
            case'months':
                timeInSeconds = time * 60 * 60 * 24 * 30;
                break;
        }
 
        // Switch for the subcommands
        switch (interaction.options.getSubcommand()) {
            case'set':
                await channel.setRateLimitPerUser(timeInSeconds);
                interaction.reply({ content: `Slowmode of ${channel} has been set to ${time} ${timeformat}`, ephemeral: true });
                break;
            case 'disable':
                await channel.setRateLimitPerUser(0);
                interaction.reply({ content: `Slowmode of ${channel} has been disabled`, ephemeral: true });
                break;
        }
 
    },
}