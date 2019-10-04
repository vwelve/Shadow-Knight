function xpHandler(client, { guild, user, createdTimestamp }) {

    const cooldown = client.cooldowns.get(guild.id+user.id) || 0;
    if (createdTimestamp - cooldown > Number("1.6667e-5")) {
        client.giveXP(100,guild,user);
        client.cooldowns.set(guild.id+user.id, createdTimestamp);
    }

}

module.exports = {
    name: "message",
    run: async (client, msg) => {
        xpHandler(client, msg);

        const msgArray = msg.split(" ");
        let cmd = client.commands.find(cmd => [cmd.name, ...cmd.alias].includes(msgArray[1]) );

        if (!cmd) return;
        if (cmd.accessLvl == "guild")
            if (!msg.guild || !msg.member.hasPermission(cmd.permission)) return;
        else if (cmd.accessLvl == "dm" && !!msg.guild) return;

        cmd.run(client, msg, msgArray.slice(1))
    }
}