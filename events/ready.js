module.exports = {
    name: "ready",
    run: async (client) => {

        client.levels.prepare("CREATE TABLE IF NOT EXISTS levels (xp INTEGER, userid TEXT, UNIQUE(userid))").run();
        client.info.prepare("CREATE TABLE IF NOT EXISTS userinfo (info TEXT, userid TEXT, rep INTEGER, UNIQUE(userid))").run();
        console.log(`NAME: ${client.user.username}\nID: ${client.user.id}`);

    }
}