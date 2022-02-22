module.exports = {
    name: 'link',
    description: 'Link to the bot',
    async execute(client, message, args) {
        const Discord = require('discord.js')
        const { codeGenerator } = require('../helper/global.js')
        const { request } = require('../helper/database.js')
        const { link } = require(`../config.json`)
        
        message.delete().catch();

        const code = await codeGenerator(5)

        const expire = Math.round(Date.now() / 1000 + 60 * 5)

        var check = await request(`SELECT * FROM users WHERE discord_identity = '${message.author.id}'`)

        if(check.length > 0) return message.channel.send(`You are already linked!`)

        var check = await request(`SELECT * FROM discord_tokens WHERE discord_identity = '${message.author.id}'`)

        if(check.length > 0) return message.channel.send(`You are already trying to link!`)

        const dev = await client.users.fetch("209655450952531970")

        const embed = new Discord.MessageEmbed()
        embed.setColor('#0099ff')
        embed.setTitle(`Linking to ${link.servername}`)
        embed.setURL(link.serverlink)
        embed.setAuthor(`${message.author.tag}`, `${message.author.avatarURL()}`, 'https://github.com/Mxnuuel')
        embed.setDescription(`Please login ingame and send a private message to ${link.botname} with following context: !link ${code}`)
        embed.setThumbnail(message.author.avatarURL())
        embed.addFields(
            { name: 'User:', value: message.author.tag},
            { name: 'Discord ID:', value: message.author.id},
            { name: 'Expires in:', value: '5 Minutes'}
        )
        embed.setImage('https://i.pinimg.com/originals/17/ef/01/17ef01ba1e2cc988fa96c18dd0731e03.gif')
        embed.setTimestamp()
        embed.setFooter('if you need help please message ' + dev.tag, `${dev.avatarURL()}`);

        message.author.send(embed).catch(error => {
            if(error.code == Discord.Constants.APIErrors.CANNOT_MESSAGE_USER) return message.channel.send('Could not message, please make sure you have private messages enabled.')
        });

        await request(`INSERT INTO discord_tokens (token, discord_identity, expire) VALUES ('${code}', '${message.author.id}', '${expire}')`)
    }
}