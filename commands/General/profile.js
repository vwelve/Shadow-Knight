const Discord = require('discord.js');

module.exports = {
    name: "profile",
    alias: ["p"],
    accessLvl: "guild",
    description:"",
    permission: "VIEW_CHANNEL",
    run: async (client, msg, args) => {
        const Canvas = require('canvas');

        async function main() {
            const canvas = Canvas.createCanvas(400, 400);
            const canvas2 = Canvas.createCanvas(400,400);
            const ctx2 = canvas2.getContext('2d');
            const ctx = canvas.getContext('2d');
            
            const background = await Canvas.loadImage('./profile-template.png');
            ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

            ctx.strokeStyle = '#74037b';
	        ctx.strokeRect(0, 0, canvas.width, canvas.height);

            const avatar = await Canvas.loadImage(msg.member.user.displayAvatarURL);
	        // Draw a shape onto the main canvas
            ctx2.drawImage(avatar, 0, 0, 400, 400);
            ctx2.globalCompositeOperation='destination-in';
            ctx2.beginPath();
            ctx2.arc(canvas2.width/2,canvas2.height/2,canvas2.height/2,0,Math.PI*2);
            ctx2.closePath();
            ctx2.fill();

            ctx.drawImage(canvas2, 9, 54, 105, 105);

            const attachment = new Discord.Attachment(canvas.toBuffer(), 'profile-image.png');
            
            msg.channel.send(attachment);
            
            
        }

        main();
    }
}