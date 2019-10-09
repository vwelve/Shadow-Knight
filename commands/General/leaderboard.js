module.exports = {
    name: "leaderboard",
    alias: ["lb"],
    accessLvl: "guild",
    description:"",
    permission: "VIEW_CHANNEL",
    run: async (client, msg, args) => {

        const [type] = args;
        let users = type == "guild" ? client.getRanks(msg.guild) : client.getRanks();
        const index = users.map(u => u.userid).indexOf(msg.author.id);

        
        let user = users[index];
        let i = 0;
        users = users.slice(0,10);
        let leaderboard = "";

        for (const u of users) {
            let { username } = await client.findUser(u.userid);
            let { xp } = u;
            leaderboard +=  `[${++i}]\t> #${username}\n\t\t\tTotal Score: ${xp}\n`;
        }
        

        footer = `-------------------------------------\n# Your Placing Stats\n😐 Rank: ${index+1} Total Score: ${user.xp}`;

        msg.channel.send(`:cityscape: | ${type ? "Guild" : "Global"} Score Leaderboards ${type ? "for "+msg.guild.name : ""}\n\n\`\`\`cs\n📋 Rank | Name\n\n${leaderboard}${footer}\n\`\`\``);
        
        

    }
}