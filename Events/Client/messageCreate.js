module.exports = {
  name: "messageCreate",
  async execute(message, client) {
    if (
      message.author.bot ||
      !message.guild ||
      message.system ||
      message.webhookId
    )
      return;

    if (!message.content.startsWith(client.config.prefix)) return; //dont have to put the prefix in config, can input it manually.
    const args = message.content
      .slice(client.config.prefix.length)
      .trim()
      .split(/ +/);

    let cmd = args.shift().toLowerCase();
    if (cmd.length === 0) return;

    let command = client.pcommands.get(cmd);
    if (!command) command = client.pcommands.get(client.aliases.get(cmd));

    if (!command) return;
    
    if (command.owner && message.author.id !== '276818714949582848') return;

    if (command.args && !args.length) {
      return message.reply(`You didn't provide any arguments.`);
    }
    
    

    try {
      command.execute(message, client, args);
    } catch (error) {
      console.error(error);
    }
  },
};
