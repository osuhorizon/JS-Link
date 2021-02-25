require("../utils/function")();
module.exports = {
    name: 'help',
    description: "pls send help",
    execute(message, args){
        const moment = require ("moment");
        const locale = moment.locale('de');
        const time = moment().format('LTS');
        
        let color = message.member.displayHexColor;
        if (color == '#000000') color = message.member.hoistRole.hexColor;
        
        const helpembed = new Discord.MessageEmbed()
        .setAuthor(message.author.tag, message.author.avatarURL())
        .setThumbnail(config.link.logo)
        .setColor(color)
        .addFields(
        { name: 'link', value: 'links yourself'},
        { name: 'unlink', value: 'unlinks yourself (duh)'},
        { name: 'ping', value:'pong?'},
        { name: 'stats', value: 'some more information about the bot'}
        )
        .setTimestamp()
        .setFooter(message.author.tag, message.author.avatarURL());
    
        message.channel.send(helpembed);
    }
}