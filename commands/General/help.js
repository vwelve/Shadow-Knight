const { RichEmbed } = require('discord.js');
const { readdirSync } = require('fs');

module.exports = {
    name: "help",
    alias: ["h"],
    accessLvl: "None",
    description: "List of all the commands or get specific information on a user.\nUsage:\n```n.help\nOR\n.help <command>\n```",
    permission: "VIEW_CHANNEL",
    run: async (client, msg, args) => {

        if (msg.guild) msg.channel.send("Sent you a dm!");

        const { dmChannel, username, avatarURL } = msg.author;
        let embed;
        let [cmd] = args;

        if (cmd) {
            if (!client.commands.find(c => [c.name, ...c.alias].includes(cmd)))
                embed = new RichEmbed()
                    .setTitle("Could not find that command.")
                    .setColor("RED")
                    .setAuthor(username, avatarURL)
                    .setDescription("Are you sure you have capitalization or spelling correct? Please check again because I am unable to find that command.")
                    .setFooter("Do `.help` to get a list of all the commands or `.help <command>` to get information on a specific command.", client.user.avatarURL)
                    .setTimestamp();
            else {
                cmd = client.commands.find(c => [c.name, ...c.alias].includes(cmd));
                embed = new RichEmbed()
                    .setTitle(cmd.name)
                    .setColor("BLUE")
                    .setAuthor(username, avatarURL)
                    .setDescription(cmd.description)
                    .setFooter("Do `.help` to get a list of all the commands or `.help <command>` to get information on a specific command.", client.user.avatarURL)
                    .setTimestamp();
            }
        } else {
            embed = new RichEmbed()
            .setTitle("Commands")
            .setColor("BLUE")
            .setAuthor(username, avatarURL)
            .setFooter("Do `.help` to get a list of all the commands or `.help <command>` to get information on a specific command.", client.user.avatarURL)
            .setTimestamp();

            for (const folder of readdirSync('./commands')) {
                let commands = [];
                for (const file of readdirSync(`./commands/${folder}`)) {
                    if (file.endsWith(".js")) {
                        cmd = require(`../${folder}/${file}`);
                        commands.push(cmd.name)
                    }
                }
                embed.addField(folder,commands.join("\n"));
            }
        }

        await dmChannel.send(embed);

    }
}