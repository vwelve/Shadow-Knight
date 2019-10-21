const { Client, Collection } = require('discord.js');
const { token } = require('./config.json');
const SQLite = require('better-sqlite3');

class Bot extends Client {
    constructor() {
        super();
        this.levels = new SQLite("./levels.db");
        this.commands = new Collection();
        this.cooldowns = new Collection();
        this.repCooldown = new Collection();
        this.globalChannels = new Collection();
        this.activeUsers = new Collection();
        this.info = new SQLite("./info.db");
    }

    /**
     * 
     * @param {the message object of the message} msg 
     */
    async messageSent(msg) {
        for (const [guild, webhook] of this.globalChannels) {
            if (guild == msg.guild.id || !webhook) continue;

            webhook.send(msg.content, {
                avatarURL: msg.author.avatarURL,
                username: msg.author.username
            });
        }
    }

    /**
     * 
     * @param {the number of experience to give the user} xp 
     * @param {the id of the user to give the experience to} id 
     */
    giveXP(xp, user) {
        if (typeof user.id != "string" || typeof xp != "number") 
            throw new Error("InputMismatch");
        try {
            this.levels.prepare("INSERT INTO levels (xp, userid) VALUES(?,?)").run(xp,user.id);
        } catch (e) {
            this.levels.prepare("UPDATE levels SET xp = xp + ? WHERE userid = ?").run(xp,user.id);            
        }
        const { xp:currentXP} = this.levels.prepare("SELECT * FROM levels WHERE userid = ?").get(user.id) || { xp: 0 };
        return currentXP;
    }

    /**
     * 
     * @param {name of the user to find} input 
     * @param {guild to search for the user in} guild 
     */
    async findUser(input, guild) {
        return new Promise(async (resolve, reject) => {
            let user = await this.fetchUser(input, true).catch(err => console.log(`${input} cannot be fetched. Continuing rest of the function now`)); // Try and fetch a user by id and cache it
            if (!user && guild) {
                try{
                    user = this.guilds.get(guild.id).members.find(m => m.user.tag.toLowerCase().startsWith(input.toLowerCase())).user; // Find the first user that starts with input
                } catch (er) {
                    return resolve(undefined);
                }
            } else if (!user) return reject(new Error("Expected value for \"guild\""));
            return resolve(user);
        }); 
    }

    /**
     * 
     * @param {the guild object of the user} guild 
     * @param {the user object of the user} user 
     */
    getXP(user) {
        if (typeof(user.id) != "string") 
            throw new Error("InputMismatch");
        const { xp } = this.levels.prepare("SELECT xp FROM levels WHERE userid = ?").get(user.id) || { xp: 0 };
        
        return xp;
    }

    getRanks(guild=undefined) {

        let users;
        if (!guild) {
            users = this.levels.prepare("SELECT * FROM levels ORDER BY xp DESC LIMIT 10").all();
            return users;
        } else {
            if (typeof(guild) != "object")
                throw new Error("InputMismatch");
            users = guild.members.filter(m=>!m.user.bot).map(m => this.levels.prepare("SELECT * FROM levels WHERE userid = ?").get(m.id) || {xp:0, userid:m.id});
            users = users.sort((a,b) => b.xp-a.xp);
            return users;
        }

    }


}

const client = new Bot();

["event","command"].forEach(h => require(`./util/${h}Handler.js`)(client));
client.login(token);