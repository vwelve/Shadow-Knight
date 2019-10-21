const Discord = require('discord.js');
const Canvas = require('canvas')
const GIFEncoder = require('gifencoder');
const gifFrames = require('gif-frames');
const fs = require('fs');

async function typeToCanvas(ctx, text, x, y, font, color) {
    ctx.font = font;
    ctx.fillStyle = color;
    ctx.fillText(text, x, y);
}

async function draw(img) {
    const canvas = Canvas.createCanvas(400,400);
    const ctx = canvas.getContext('2d');
    const avatar = await Canvas.loadImage(img);

    ctx.drawImage(avatar,0,0, 400, 400);
    ctx.globalCompositeOperation='destination-in';
    ctx.beginPath();
    ctx.arc(200,200,200,0, Math.PI*2);
    ctx.closePath();
    ctx.fill();
    
    return canvas;
}

async function get_frames(image, user, userinfo, xp, guild, global){
    const canvas = Canvas.createCanvas(400,400);
    const ctx = canvas.getContext('2d');
    const background = await Canvas.loadImage('./Templates/profile-template.png');
    const avatar = await draw(image);
    
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(avatar, 10, 52, 101, 104.8);

    await typeToCanvas(ctx, user.username, 115, 140, '20px sans-serif', "#A9A900");
    await typeToCanvas(ctx, `+${userinfo.rep || 0} rep`, 25, 177, '25px sans-serif', '#FFFFFF');
    await typeToCanvas(ctx, `Guild #${guild}`, 158, 197, '17px serif', '#A8A8A8');
    await typeToCanvas(ctx, `Global #${global}`, 250, 197, '17px serif', '#A8A8A8');
    await typeToCanvas(ctx, xp, 150, 213, '17px serif', '#A8A8A8');
    await typeToCanvas(ctx, userinfo.info || "Mysterious 👀", 117, 280, '17px serif', '#A8A8A8');
    
    return ctx;
}

module.exports = {
    name: "profile",
    alias: ["p"],
    accessLvl: "guild",
    description:"",
    permission: "VIEW_CHANNEL",
    run: async (client, msg, args) => {
    
        let user; 
        let i = 0;
        try {
            user = await client.findUser(args[0].replace(/^<@(\d+)>/, "$1"), msg.guild) || msg.author;
        } catch {
            user = msg.author;
        }
        const guild = client.getRanks(msg.guild).map(u => u.userid).indexOf(user.id) + 1;
        const global = client.getRanks().map(u => u.userid).indexOf(user.id);
        const xp = client.getRanks(msg.guild).map(u => [u.userid,u.xp])[guild-1][1];
        const userinfo = client.info.prepare("SELECT * FROM userinfo WHERE userid = ?").get(user.id) || {info:"Mysterious 👀", rep:0};
        const avatar = user.displayAvatarURL;
        const encoder = new GIFEncoder(400, 400);
        
        let profile;

        if (avatar.endsWith(".gif")) {
            
            await new Promise(async (resolve,reject) => {
                encoder.createReadStream().pipe(fs.createWriteStream('myanimated.gif')).on('finish', resolve);
                encoder.start();
                encoder.setRepeat(0);   // 0 for repeat, -1 for no-repeat
                encoder.setDelay(100);  // frame delay in ms
                encoder.setQuality(10); // image quality. 10 is default.
    
                
                await gifFrames({url: avatar, frames:"all"}).then( async (frameData) => {

                    for (const frame of frameData) {
                        
                            await new Promise((resolve, reject) => {
                                try {
                                    frame.getImage().pipe(fs.createWriteStream('./stream.png')).on('finish', resolve); 
                                } catch {
                                    reject;
                                }
                            });
                        
                            
                            let options = [
                                fs.readFileSync('./stream.png'),
                                user,
                                userinfo, 
                                xp, 
                                guild, 
                                global > -1 ? global+1 : "Not Ranked."
                            ];

                            const ctx = await get_frames(...options);
                            encoder.addFrame(ctx);
                        
                        
                    }
                        

                });
                

                encoder.finish();
            });
                       
            profile = fs.readFileSync('./myanimated.gif');
            
        } else {
            options = [
                avatar,
                user,
                userinfo, 
                xp, 
                guild, 
                global > -1 ? global+1 : "Not Ranked."
            ];
            let ctx = await get_frames(...options)
            profile = await ctx.canvas.toBuffer();
        }
        
        const attachment = new Discord.Attachment(profile, 'card.gif');
        
        msg.channel.send(attachment);
    }
}