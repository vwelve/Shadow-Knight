const reqEvent = event => require(`../events/${event}.js`);

module.exports = (client) => {

    client.on("ready",()=>{reqEvent('ready')(client)});
    client.on("message",async (msg)=>{reqEvent('message')(client,msg)});
    client.on("voiceStateUpdate",async (oMember,nMember) =>{reqEvent('voiceUpdate')(client,oMember,nMember)});

}