module.exports = {
    name: "setglobalchannel",
    alias: ["setgc"],
    accessLvl: "guild",
    description: "Sets a channel as the global channel if there isn't already.\nUsage:\n```\n.setgc #channelName\n```",
    permission: "MANAGE_GUILD",
    run: async (client, msg, args) => {

        const channel = msg.mentions.channels.first();
        if (!channel)
            return msg.channel.send("Please mention the channel you would like to set as the global channel.");

        try {
            let webhook = client.globalChannels.get(msg.guild.id);

            if (webhook)
                return msg.channel.send("You already have a channel set as a global channel. Please delete it to continue.");

            webhook = await channel.createWebhook("Group", client.user.avatarURL);
            webhook.channel = true;
            client.globalChannels.set(msg.guild.id, webhook);
            msg.channel.send(`Successfully set ${channel} as the global channel`);
        } catch(er) {
            return msg.channel.send("I do not have permission to create a webhook. Please check my permissions.");
        }
    
    }
}