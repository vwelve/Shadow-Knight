module.exports = {
    name: "removerole",
    alias: ["removerole","roledelete"],
    accessLvl: "guild",
    description: `Removes the role of a the role of a user.\nUsage: \`\`\`\n.addrole <user> <role>\n\`\`\``,
    permission: "MANAGE_ROLES",
    run: async (client, msg, args) => {

        const role = msg.guild.roles.find(r => r.name.toLowerCase() == args.slice(1).join(" ").toLowerCase());
        let user = args[0].replace(/^<@(\d+)>$/,"$1");
        user = await client.findUser(user, msg.guild);

        if (!role)
            return msg.channel.send("Could not find that role.");
        else if (role.position >= msg.guild.me.highestRole.position || (role.position >= msg.member.highestRole.position && !msg.guild.owner))
            return msg.channel.send("The position of the role you tried to add is too high for me to remove.");
        else if (!user)
            return msg.channel.send("Could not find that user.");

        const member = msg.guild.members.get(user.id);
        await member.removeRole(role).then(async () => {
            await msg.react("✅");
        });
        

    }
}