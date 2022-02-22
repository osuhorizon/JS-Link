module.exports = {
    name: 'unrestrict',
    description: 'restrict a user from using the bot',
    async execute(client, message, args) {
        const { request } = require("../helper/database")
        const { log, webhook, note, checkPermission } = require("../helper/osu")
        const Discord = require('discord.js')

        const admin = await request(`SELECT id, username, privileges FROM users WHERE discord_identity = '${message.author.id}'`)

        if(admin.length == 0) return message.channel.send("You are not linked to the bot")

        if(!checkPermission(admin[0].privileges, 32)) return message.channel.send("You are not allowed to use this command")

        if(!args[0]) return message.channel.send("Please provide a username");

        const user = args[0].toLowerCase();

        const check = await request(`SELECT username, id, privileges FROM users WHERE username_safe = '${user}'`);

        if(check.length == 0) return message.channel.send("That user does not exist");

        if(checkPermission(check[0].privileges, 1)) return message.channel.send("That user is already restricted");

        if(check[0].privileges >= admin[0].privileges && check[0].privileges != 1048576) return message.channel.send("You cannot unrestrict a user with the same or higher privileges than you");

        await request(`UPDATE users SET privileges = '${parseInt(check[0].privileges + 1)}' WHERE username_safe = '${user}'`);

        message.channel.send(`${check[0].username} has been unrestricted`);

        await log(admin[0].id, `has unrestricted ${check[0].username}`);
        await note(check[0].id, `has been unrestricted by ${admin[0].username}`);

        const embed = new Discord.MessageEmbed()
        .setTitle(`${check[0].username} just got unrestricted`)
        .setURL(`https://lemres.de/u/${check[0].id}`)
        .setColor("#66ff99")
        .setAuthor(admin[0].username, `https://a.lemres.de/${admin[0].id}`)
        .setImage(`https://a.lemres.de/${check[0].id}`)
        .setFooter(`Unrestricted via Discord by ${admin[0].username}`)

        await webhook(embed, "restrict")

    }
}