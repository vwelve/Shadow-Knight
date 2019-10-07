const { readdirSync} = require('fs');

module.exports = (client) => {

    for (const file of readdirSync('./events')) {
        
        if (!file.endsWith('.js')) return;

        const event = require(`../events/${file}`);
        if (typeof(event.run) == "function" && typeof(event.name) == "string")
            client.on(event.name, (...args) => event.run(client, ...args));
        
    }

}