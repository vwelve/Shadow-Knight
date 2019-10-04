const { Client, Collection } = require('discord.js');
const { token } = require('./config.json');
const SQLite = require('better-sqlite3');

class Bot extends Client {
    constructor() {
        super();
        this.levels = new SQLite("./levels.db");
        this.commands = new Collection();
        this.cooldown = new Collection();
    }

    /**
     * 
     * @param {the number of experience to give the user} xp 
     * @param {the id of the user to give the experience to} id 
     */
    giveXP(xp, guild, user) {
        if (typeof id != "string" || typeof xp != "number") 
            throw new Exception("InputMismatch");
        try {
            this.levels.prepare("UPDATE levels SET xp = xp + ? WHERE id = ?, guild = ?").run(xp,user.id, guild.id);
        } catch (e) {
            this.levels.prepare("INSERT INTO levels (xp, guild, id) (?,?,?)").run(xp,guild.id,user.id)
        }
        const { xp:currentXP } = this.levels.prepare("SELECT xp WHERE guild = ?, id = ?").get(guild.id,user.id);
        return currentXP;
    }

    findUser(input, guild) {
        let user = this.fetchUser(input, true); // Try and fetch a user by id and cache it
        if (!user)
            user = this.guilds.get(guild.id).members.find(m => m.user.username.startsWith(input)); // Find the first user that starts with input
        return user;
    }

    getXP(guild, user) {
        if (typeof id != "string") 
            throw new Exception("InputMismatch");
        const { xp } = this.levels.prepare("SELECT xp WHERE guild = ?, id = ?").get(guild.id,user.id);
        return xp;
    }

}

const client = new Bot();

["event","command"].forEach(h => require(`./util/${h}Handler.js`)(client));
client.login(token);