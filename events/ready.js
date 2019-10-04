const SQLite = require('better-sqlite3');

module.exports = {
    name: "ready",
    run: async ({user}) => {

        const levels = new SQLite('./levels.db');
        levels.prepare("CREATE TABLE IF NOT EXISTS levels (xp INTEGER, guild INTEGER, id INTEGER)");
        console.log(`NAME: ${user.username}\nID: ${user.id}`);

    }
}