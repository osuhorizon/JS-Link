module.exports = {
    name: 'rename',
    description: 'rename a user',
    async execute(client, message, args) {
        const { request } = require("../helper/database")
        const { log, note, webhook, checkPermission } = require("../helper/osu")
        const Discord = require('discord.js')

        const admin = await request(`SELECT id, username, username_safe, privileges FROM users WHERE discord_identity = '${message.author.id}'`)

        if(admin.length == 0) return message.channel.send("You are not linked to the bot")

        const self = !args[1]

        if(!self){
            if(!checkPermission(admin[0].privileges, 16)) return message.channel.send("You are not allowed to use this command on someone else")
        } else {
            if(!checkPermission(admin[0].privileges, 4)) return message.channel.send("You are not allowed to use this command")
        }

        if(!args[0]) return message.channel.send("Please specify a username")

        const target = self ? admin[0].username_safe : args[0].toLowerCase()

        const username = self ? args[0] : args[1]

        const check = await request(`SELECT username, id, privileges FROM users WHERE username_safe = '${target}'`)

        if(check.length == 0) return message.channel.send("That user does not exist")

        if(check[0].privileges >= admin[0].privileges && check[0].privileges != 1048576 && !self) return message.channel.send("You cannot rename a user with the same or higher privileges than you")

        const namecheck = await request(`SELECT username, id, privileges FROM users WHERE username_safe = '${username}'`)

        if(namecheck.length != 0) return message.channel.send("That username is already taken")

        await request(`UPDATE users SET username = '${username.replace("_", " ")}', username_safe = '${username.toLowerCase()}' WHERE username_safe = '${target}'`)

        message.channel.send(`Successfully renamed ${self ? "yourself" : `${check[0].username}`} to ${username.replace("_", " ")}`)

        await log(admin[0].id, `has renamed ${self ? "themselves" : `${check[0].username}`} to ${username.replace("_", " ")}`)
        await note(check[0].id, `Username change: '${check[0].username}' -> '${username.replace("_", " ")}' ${self ? "" : "by " + admin[0].username}`)

        const embed = new Discord.MessageEmbed()
        .setTitle(`${admin[0].username} renamed ${self ? "themselves" : `${check[0].username}`} to ${username.replace("_", " ")}`)
        .setURL(`https://lemres.de/u/${check[0].id}`)
        .setDescription("Renamed to: " + username.replace("_", " "))
        .setColor("#f6f688")
        .setAuthor(admin[0].username, `https://a.lemres.de/${admin[0].id}`)
        .setImage(`https://a.lemres.de/${check[0].id}`)
        .setFooter(`Renamed via Discord`)
        
        await webhook(embed, "rename")
    }
}