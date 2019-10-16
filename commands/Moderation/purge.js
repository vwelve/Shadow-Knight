async function deleteMessages(number, channel) {

    await channel.bulkDelete(number, true);
    if (number > 100)
        for (let i = 0; i < Math.floor((number-100)/100); i++)
            await channel.bulkDelete(100, true);
    
}

module.exports = {
    name: "purge",
    alias: ["delete","cleanup"],
    accessLvl: "guild",
    description: "Purges messages from the guild.\nUsage:\n```\n.purge <number>\n```",
    permission: "MANAGE_MESSAGES",
    run: async (_client, msg, args) => {

        const number = parseInt(args[0]);
        const { channel } = msg;

        if (isNaN(number))
            return msg.channel.send("Please specifiy how many messages you would like to delete.");

        await msg.delete();
        deleteMessages(number, channel);
    
    }
}