module.exports = {
    name: "say",
    alias: ["repeat"],
    accessLvl: "guild",
    permission: "VIEW_CHANNEL",
    description: "Repeats what the user said.",
    run: async (client, msg, args) => {
        msg.channel.send(msg.content);
    }
}