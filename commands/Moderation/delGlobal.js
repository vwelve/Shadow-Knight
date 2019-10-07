module.exports = {
    name: "deleteglobalchannel",
    alias: ["delgc"],
    accessLvl: "guild",
    description: "Removes the global channel if there is one.\nUsage:\n```\n.delgc #channelName\n```",
    permission: "MANAGE_GUILD",
    run: async (client, msg, args) => {

        client.globalChannels.set(msg.guild.id,false);
        msg.channel.send("No global channels for this server.");
    
    }
}