module.exports = {
    name: "ready",
    run: async (client) => {

        client.levels.prepare("CREATE TABLE IF NOT EXISTS levels (xp INTEGER, guild INTEGER, userid INTEGER)").run();
        console.log(`NAME: ${client.user.username}\nID: ${client.user.id}`);

    }
}