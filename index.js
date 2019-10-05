const { Client, Collection } = require('discord.js');
const { token } = require('./config.json');
const fetch = require("node-fetch");
const SQLite = require('better-sqlite3');

class Bot extends Client {
    constructor() {
        super();
        this.levels = new SQLite("./levels.db");
        this.commands = new Collection();
        this.cooldown = new Collection();
        this.globalChannels = new Collection();
        
    }

    /**
     * 
     * @param {the message object of the message} msg 
     */
    async messageSent(msg) {
        await fetch("", {
            method:"POST",
            body: JSON.stringify()
        });
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

    /**
     * 
     * @param {name of the user to find} input 
     * @param {guild to search for the user in} guild 
     */
    async findUser(input, guild) {
        return new Promise(async (resolve, reject) => {
            let user = await this.fetchUser(input, true); // Try and fetch a user by id and cache it
            if (!user && guild) {
                try{
                    user = this.guilds.get(guild.id).members.find(m => m.user.tag.startsWith(input)).user; // Find the first user that starts with input
                } catch (er) {
                    resolve(user);
                }
            } else if (!user) reject(new Exception("Expected value for \"guild\""));
            resolve(user);
        }); 
    }

    /**
     * 
     * @param {the guild object of the user} guild 
     * @param {the user object of the user} user 
     */
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