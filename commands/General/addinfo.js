module.exports = {
    name: "addinfo",
    alias: ["info"],
    accessLvl: "guild",
    permission: "V_CHANNEL",
    run: async (client, msg, args) => {
        try{
            client.info.prepare("INSERT INTO userinfo (info, userid, rep) VALUES(?, ?, 0)").run(args[0] || "Mysterious 👀", msg.author.id);
        } catch {
            client.info.prepare("UPDATE userinfo SET info = ? WHERE userid = ?").run(args[0] || "Mysterious 👀", msg.author.id);
        }
    }
}