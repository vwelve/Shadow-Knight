function deleteMessages(number, channel) {
    let i;
    for (i = 0; i < Math.floor(number/100); ++i)
        channel.bulkDelete(100);
    
    if (number - i*100)
        channel.bulkDelete(i*100);
}

module.exports = {
    name: "purge",
    alias: ["delete","cleanup"],
    accessLvl: "guild",
    description: "Purges messages from the guild.\nUsage:\n```\n.purge <number>\n```",
    permission: "MANAGE_MESSAGES",
    run: async (_client, msg, args) => {

        const number = parseInt(args[0]);
        if (isNaN(number))
            return msg.channel.send("Please specifiy how many messages you would like to delete.");

        deleteMessages(number, msg.channel);
    
    }
}