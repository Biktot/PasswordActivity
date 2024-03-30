const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  ChatInputCommandInteraction,
  Client,
  EmbedBuilder,
  PermissionFlagsBits,
  SlashCommandBuilder,
} = require("discord.js");
const ms = require("ms");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("channel")
    .setDescription("Manage the channels of the discord server.")
    .addSubcommand((command) =>
      command
        .setName("nuke")
        .setDescription(
          "Deletes a channel and then clones it again (not a raid command)."
        )
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription("*The channel to nuke.")
            .addChannelTypes(
              ChannelType.GuildText,
              ChannelType.GuildAnnouncement,
              ChannelType.GuildVoice
            )
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("reason")
            .setDescription("*The reason for nuking the channel.")
            .setRequired(true)
            .setMaxLength(512)
        )
        .addStringOption((option) =>
          option
            .setName("type")
            .setDescription("*Specify the channel type.")
            .addChoices(
              { name: `Text Channel`, value: `text` },
              { name: `Voice Channel`, value: `voice` },
              { name: `Announcement Channel`, value: `announcement` }
            )
            .setRequired(true)
        )
        .addBooleanOption((option) =>
          option
            .setName("send-message")
            .setDescription(
              "*Whether or not to send a message in the new channel."
            )
            .setRequired(true)
        )
    )
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const sub = interaction.options.getSubcommand();

    switch (sub) {
      case "nuke":
        {
          const { options, guild } = interaction;
          const channel = options.getChannel("channel");
          const Reason = options.getString("reason");
          const type = options.getString("type");

          // Send message option.
          const sendMSG = options.getBoolean("send-message");

          // Getting channel info.
          const channelID = await guild.channels.cache.get(channel.id);

          if (!channel)
            return interaction.reply({
              embeds: [
                new EmbedBuilder()
                  .setColor("Red")
                  .setDescription(
                    `:warning: | The channel specified does not exist.`
                  ),
              ],
            });

          const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId("nukeConfirm")
              .setLabel("Confirm")
              .setStyle(ButtonStyle.Success),

            new ButtonBuilder()
              .setCustomId("nukeCancel")
              .setLabel("Cancel")
              .setStyle(ButtonStyle.Danger)
          );

          const disabledRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId("nukeConfirm")
              .setLabel("Confirm")
              .setStyle(ButtonStyle.Success)
              .setDisabled(true),

            new ButtonBuilder()
              .setCustomId("nukeCancel")
              .setLabel("Cancel")
              .setStyle(ButtonStyle.Danger)
              .setDisabled(true)
          );

          const embed = new EmbedBuilder()
            .setColor("Red") // Please remember to change the embed colors. If you ping me about an error, please expect to be ignored.
            .setDescription(
              `:warning: | You are about to nuke the channel <#${channel.id}> and all data will be deleted. Please make a decision below.`
            )
            .addFields(
              { name: `Reason`, value: `${Reason}`, inline: true },
              { name: `Type`, value: `${type} channel`, inline: true },
              { name: `Send Message`, value: `${sendMSG}`, inline: true }
            );

          const message = await interaction.reply({
            embeds: [embed],
            components: [row],
          });

          const collector = message.createMessageComponentCollector({
            time: ms("10m"),
          });

          collector.on("collect", async (c) => {
            if (c.customId === "nukeConfirm") {
              if (c.user.id !== interaction.user.id) {
                return await c.reply({
                  embeds: [
                    new EmbedBuilder()
                      .setDescription(
                        `:warning: | Only ${interaction.user.tag} can interact with these buttons.`
                      )
                      .setColor("Red"),
                  ],
                  ephemeral: true,
                });
              }

              await guild.channels.delete(channelID);

              if (type === "text") {
                const newChannel = await guild.channels
                  .create({
                    name: channel.name,
                    type: ChannelType.GuildText,
                    topic: channel.topic || null,
                    parent: channel.parent,
                  })
                  .catch((err) => {
                    interaction.reply({
                      embeds: [
                        new EmbedBuilder()
                          .setColor("Red")
                          .setDescription(
                            `:warning: | I cannot nuke the channel; please ensure that I have the *manage_channels* permission.`
                          ),
                      ],
                      ephemeral: true,
                    });
                  });

                const channelembed = new EmbedBuilder()
                  .setColor(client.config.embed)
                  .setDescription(
                    `:white_check_mark: | The channel **#${channel.name}** has been deleted with the reason ${Reason}. The new channel is <#${newChannel.id}>.`
                  );

                await c.update({
                  embeds: [channelembed],
                  components: [disabledRow],
                });

                if (sendMSG === false) return;
                else {
                  /*
                                const choice = [
                                    "https://tenor.com/view/walter-white-gif-25141525",
                                    "https://media3.giphy.com/media/oe33xf3B50fsc/giphy.gif",
                                ];
                
                                const gif = Math.round(Math.random() * choice.length);
                                */
                  await newChannel.send({
                    embeds: [
                      new EmbedBuilder()
                        .setColor(client.config.embed)
                        .setDescription(
                          `:bomb: | This channel was nuked by ${interaction.user}.`
                        )
                        .setImage(
                          "https://media3.giphy.com/media/oe33xf3B50fsc/giphy.gif"
                        )
                        .setTimestamp(),
                    ],
                  });
                }
              }

              if (type === "voice") {
                const newChannel = await guild.channels
                  .create({
                    name: channel.name,
                    type: ChannelType.GuildVoice,
                    parent: channel.parent,
                  })
                  .catch((err) => {
                    interaction.reply({
                      embeds: [
                        new EmbedBuilder()
                          .setColor("Red")
                          .setDescription(
                            `:warning: | I cannot nuke the channel; please ensure that I have the *manage_channels* permission.`
                          ),
                      ],
                      ephemeral: true,
                    });
                  });

                const channelembed = new EmbedBuilder()
                  .setColor(client.config.embed)
                  .setDescription(
                    `:white_check_mark: | The channel **#${channel.name}** has been deleted with the reason ${Reason}. The new channel is <#${newChannel.id}>.`
                  );

                await c.update({
                  embeds: [channelembed],
                  components: [disabledRow],
                });

                if (sendMSG === false) return;
                else {
                  await newChannel.send({
                    embeds: [
                      new EmbedBuilder()
                        .setColor(client.config.embed)
                        .setDescription(
                          `:bomb: | This channel was nuked by ${interaction.user}.`
                        ),
                    ],
                  });
                }
              }

              if (type === "announcement") {
                const newChannel = await guild.channels
                  .create({
                    name: channel.name,
                    type: ChannelType.GuildAnnouncement,
                    topic: channel.topic || null,
                    parent: channel.parent,
                  })
                  .catch((err) => {
                    interaction.reply({
                      embeds: [
                        new EmbedBuilder()
                          .setColor("Red")
                          .setDescription(
                            `:warning: | I cannot nuke the channel; please ensure that I have the *manage_channels* permission.`
                          ),
                      ],
                      ephemeral: true,
                    });
                  });

                const channelembed = new EmbedBuilder()
                  .setColor(client.config.embed)
                  .setDescription(
                    `:white_check_mark: | The channel **#${channel.name}** has been deleted with the reason ${Reason}. The new channel is <#${newChannel.id}>.`
                  );

                await c.update({
                  embeds: [channelembed],
                  components: [disabledRow],
                });

                if (sendMSG === false) return;
                else {
                  await newChannel.send({
                    embeds: [
                      new EmbedBuilder()
                        .setColor(client.config.embed)
                        .setDescription(
                          `:bomb: | This channel was nuked by ${interaction.user}.`
                        ),
                    ],
                  });
                }
              }
            }

            if (c.customId === "nukeCancel") {
              if (c.user.id !== interaction.user.id) {
                return await c.reply({
                  embeds: [
                    new EmbedBuilder()
                      .setDescription(
                        `:warning: | Only ${interaction.user.tag} can interact with these buttons.`
                      )
                      .setColor("Red"),
                  ],
                  ephemeral: true,
                });
              }

              const message = await c.update({
                embeds: [
                  new EmbedBuilder()
                    .setColor(client.config.embed)
                    .setDescription(
                      `:white_check_mark: | The nuke request has been successfully cancelled.`
                    ),
                ],
                components: [disabledRow],
                fetchReply: true,
              });
            }
          });

          // If you want to, you can put this part in.
          /*
                collector.on(`end`, async (collected) => {
                    await interaction.editReply({
                        embeds: [
                            embed.setFooter({
                                text: `Your time has expired. If required, please rerun the command.`
                            })
                        ],
                        components: [disabledRow],
                    });
                });
                */
        }
        break;
    }
  },
};
