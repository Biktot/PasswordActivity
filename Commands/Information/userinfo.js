const { SlashCommandBuilder, EmbedBuilder } = require(`discord.js`);

module.exports = {
    data: new SlashCommandBuilder()
    .setName("userinfo")
    .setDescription(`Get info of a member in the server.`)
    .addUserOption(option => option.setName(`user`).setDescription(`the user you want to get info from`).setRequired(false)),
    async execute (interaction, client) {

        const formatter = new Intl.ListFormat(`en-GB`, { style: `narrow`, type: `conjunction` });
        
        //Change the emojis down below
        const badges = {
            BugHunterLevel1: "<:BugHunterLevel1:1096797668354826301>",
            BugHunterLevel2: "<:bug_hunter_level_2:1096797663598481408>",
            HypeSquadOnlineHouse1: "<:Bravery:1096798201362788453>",
            HypeSquadOnlineHouse2: "<:brilliance:1096798364093394984>",
            HypeSquadOnlineHouse3: "<:balance:1096798674769694730>",
            Hypesquad: "<:m0dE_Hypersquad_VIP:1096798948921987203>",
            Nitro: "",
            Boost: "",
            Partner: "<a:partner:1096799196931166208>",
            PremiumEarlySupporter: "<a:early_supporter:1096799043931353148>",
            Staff: "<a:DiscordStaff:1096799344914612234>",
            VerfiedDeveloper: "<:Developer:1096795882856394956>",
            ActiveDeveloper: "<:ActiveDeveloper:1096799614159556711>",
        }

        const user = interaction.options.getUser(`user`) || interaction.user;
        const userFlags = user.flags.toArray();
        const member = await interaction.guild.members.fetch(user.id);
        const topRoles = member.roles.cache
        .sort((a, b) => b.position - a.position)
        .map(role => role)
        .slice(0, 1)
        const banner = await (await client.users.fetch(user.id, { force: true })).bannerURL({ size: 4096 });
        const booster = member.premiumSince ? `<a:boost:1096796252605255701> Yes` : `No`; //Change the emoji
        const ownerE = `<:owner:1096795726547267736>`// change the server owner emoji
        const devs = `<:Developer:1096795882856394956>` // change the bot dev emoji
        const owners = [
            `536944480469909569`, // id for the devs of the bot
        ]
        const MutualServers = []
        const JoinPosition = await interaction.guild.members.fetch().then(Members => Members.sort((a, b) => a.joinedAt - b.joinedAt).map((User) => User.id).indexOf(member.id) + 1)

        for (const Guild of client.guilds.cache.values()) {
            if (Guild.members.cache.has(member.id)) {
                MutualServers.push(`[${Guild.name}](https://discord.com/guilds/${Guild.id})`)
            }
        }

        const bot = new EmbedBuilder() // you can remove this if you want
        .setColor(client.config.embed)
        .setDescription(`Bots are not available`)
        if (member.user.bot) return await interaction.channel.sendTyping(), await interaction.reply({ embeds: [bot]});

        const embed = new EmbedBuilder()
        .setAuthor({ name: `information`, iconURL: member.displayAvatarURL()})
        .setTitle(`**${member.user.tag}**`)
        .setColor(client.config.embed)
        .setThumbnail(member.displayAvatarURL())
        .setDescription(`**Id** - ${member.id}\n• **Boosted** - ${booster}\n• **Top Role** - ${topRoles}\n• **Joined** - <t:${parseInt(member.joinedAt / 1000)}:R>\n• **Discord User** - <t:${parseInt(user.createdAt / 1000)}:R>`)
        .addFields({ name: `Banner`, value: banner ? " " : "None"})
        .setImage(banner)
        .setFooter({ text: `${member ? `Join Position - ${JoinPosition} | ` : ''}Mutual Servers - ${MutualServers.length}`})
        
        // if the member id is equal to server owner
        if (member.id == interaction.guild.ownerId) {
            embed
            .setTitle(`**${member.user.tag}** ${ownerE}`)
        }
        // if the member id is equal to the bot owners
        if (owners.includes(member.id)) {
            embed
            .setTitle(`**${member.user.tag}** ${devs}`)
        }
        // if the member id is equal to server owner and bot owners
        if (owners.includes(member.id) && member.id == interaction.guild.ownerId) {
            embed
            .setTitle(`**${member.user.tag}** ${devs} ${ownerE}`)
        }

        await interaction.reply({ embeds: [embed] });
    }
}