module.exports = {
    name: "ban",
    alias: [],
    accessLvl: "guild",
    permission: "BAN_MEMBERS",
    description: "Bans a user from the guild.\nUsage:\n```\n.ban <user>\n```",
    run: async (client, msg, args) => {

        let user = args[0].replace("^@","");
        const reason = args.slice(1) || "None";
        user = await client.findUser(msg.mentions.users.first() || user, msg.guild);
    
        if (!user)
            return msg.channel.send("Check your spelling, could not find that user.");
        
        const member = msg.guild.members.get(user.id);
        member.ban({reason}).then(async user => {
            await msg.channel.send(`Successfully banned ${user}.`);
            await user.send(`You were banned from ${msg.guild}\nReason: ${reason}`)
                .catch(console.error);
        }).catch(() => {
            msg.channel.send("I do not have permission to ban this user.");
        });

    }
}