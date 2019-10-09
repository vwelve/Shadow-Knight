const { prefix } = require('../config.json');

function xpHandler(client, { guild, author:user, createdTimestamp }) {

    if (!guild) return;
    
    const cooldown = client.cooldowns.get(user.id) || 0;
    console.log(cooldown)
    if (createdTimestamp - cooldown > Number("3e+5")) {
        client.giveXP(100,user);
        client.cooldowns.set(user.id, createdTimestamp);
    }

}

module.exports = {
    name: "message",
    run: async (client, msg) => {
        if(msg.author.bot) return;

        xpHandler(client, msg);

        const msgArray = msg.content.split(" ");
        let cmd = client.commands.find(cmd => [cmd.name, ...cmd.alias].includes(msgArray[0].slice(1)) );
        const gc = msg.guild ? (client.globalChannels.get(msg.guild.id) || {channel:undefined}) : {channel:undefined};

        if (gc.channel == msg.channel.id) {
            client.messageSent(msg);
        } else {
            if (!msgArray[0].startsWith(prefix)) return;
            if (!cmd) return;
            if (cmd.accessLvl == "guild")
                if (!msg.guild || !msg.member.hasPermission(cmd.permission)) return;
            else if (cmd.accessLvl == "dm" && !!msg.guild) return;

            cmd.run(client, msg, msgArray.slice(1));
        }
    }
}