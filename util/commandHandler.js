const { readdirSync} = require('fs');

module.exports = (client) => {

    for (const folder of readdirSync('./commands')) {
        for (const file of readdirSync(`./commands/${folder}`)) {
            if (!file.endsWith('.js')) return;

            const command = require(`../commands/${folder}/${file}`);
            if (typeof(command.run) == "function")
                client.commands.set(command.name, command);
        }
    }

}