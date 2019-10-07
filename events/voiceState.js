module.exports = {
    name: "voiceStateUpdate",
    run: async (client, oldMember, newMember) => {

        if (newMember.user.bot) return;
        
        if (newMember.voiceChannel && !newMember.mute && !newMember.deaf) {
            client.activeUsers.set(newMember.guild.id+"-"+newMember.id, setInterval(() => {client.giveXP(100, newMember.guild.id, newMember.user)},Number("1.6667e+5")));
        } else {
            client.activeUsers.delete(newMember.guild.id+"-"+newMember.id);
        }

    }
}