module.exports = {
    name: "kick",
    alias: [],
    accessLvl: "guild",
    permission: "KICK_MEMBERS",
    description: "Kicks a user from the guild.\nUsage:\n```\n.kick <user>\n```",
    run: async (client, msg, args) => {

        let user = args[0].replace(/^<@(\d+)>$/,"$1");
        const reason = args.slice(1) || "None";
        user = await client.findUser(user, msg.guild);
    
        if (!user)
            return msg.channel.send("Check your spelling, could not find that user.");
        
        const member = msg.guild.members.get(user.id);
        member.ban({reason}).then(async user => {
            await msg.react("✅");
            await user.send(`You were kicked from ${msg.guild}\nReason: ${reason}`)
                .catch(console.error);
        }).catch(() => {
            msg.channel.send("I do not have permission to kick this user.");
        });

    }
}