module.exports = {
    name: "rep",
    alias: [],
    accessLvl: "guild",
    permission: "VIEW_CHANNEL",
    run: async (client, msg, args) => {
        
        const cooldown = client.repCooldown.get(msg.author.id) || 0;
        const user = await client.findUser(args[0].replace(/^<@(\d+)>/, "$1"), msg.guild);
        
        if (msg.createdTimestamp - cooldown < Number("8.64e+7"))
            return msg.channel.send("Please wait a day before giving out reputation again.");

        if (!user)
            return msg.channel.send("Could not find the user.");

        client.repCooldown.set(msg.author.id, msg.createdTimestamp);
        try{
            client.info.prepare("INSERT INTO userinfo (userid, rep, info) VALUES(?,1,?)").run(user.id,"Mysterious 👀");
        } catch {
            client.info.prepare("UPDATE userinfo SET rep = rep + 1 WHERE userid = ?").run(user.id);
        }

        msg.react("✅");
        

        
    }
}