module.exports = {
    name: "addrole",
    alias: ["giverole","roleadd"],
    accessLvl: "guild",
    description: `Gives the role of a the role of a user.\nUsage: \`\`\`\n.addrole <user> <role>\n\`\`\``,
    permission: "MANAGE_ROLES",
    run: async (client, msg, args) => {

        const role = msg.guild.roles.find(r => r.name == args.slice(1).join(" "))
        let user = args[0].replace("^@","");
        user = await findUser(user);

        if (!role)
            return msg.channel.send("Could not find that role.");
        else if (role.position > msg.guild.me.highestRole.position || role.position > msg.member.highestRole.position)
            msg.channel.send("The position of the role you tried to add is too high for me to give.");
        else if (!user)
            msg.channel.send("Could not find that user.");

        const member = msg.guild.members.get(user.id);
        member.addRole(role);

    }
}