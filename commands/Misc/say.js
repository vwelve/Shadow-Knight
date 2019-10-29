module.exports = {
    name: "say",
    alias: ["repeat"],
    accessLvl: "guild",
    permission: "VIEW_CHANNEL",
    run: async (client, msg, args) => {
        msg.channel.send(msg.content);
    }
}