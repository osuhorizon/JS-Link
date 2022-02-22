module.exports = {
    name: 'newpass',
    description: 'reset your password',
    async execute(client, message, args) {
        const md5 = require('md5');
        const bcrypt = require('bcrypt');
        const { request } = require("../helper/database");
        const { codeGenerator } = require("../helper/global");
        const { log } = require("../helper/osu");

        //TODO: Make function for single user requests

        const admin = await request(`SELECT id, privileges FROM users WHERE discord_identity = '${message.author.id}'`)

        if(admin.length == 0) return message.channel.send("You are not linked to the bot")

        //TODO: Grab from list of privileges

        if(admin[0].privileges & 8 << 1 == 0) return message.channel.send("You are not allowed to use this command")

        if(!args[0]) return message.channel.send("Please provide a username");

        const user = args[0].toLowerCase();

        const check = await request(`SELECT username, id, privileges FROM users WHERE username_safe = '${user}'`);

        if(check.length == 0) return message.channel.send("That user does not exist");

        if(check[0].privileges >= admin[0].privileges && check[0].privileges != 1048576) return message.channel.send("You cannot reset a user with the same or higher privileges than you");

        const code = await codeGenerator(8);

        const hash = await bcrypt.hash(md5(code), 10)

        await request(`UPDATE users SET password_md5 = '${hash}' WHERE username_safe = '${user}'`);

        message.author.send(`A new password for ${check[0].username} has been set.\nPassword: ||${code}||`);

        await log(admin[0].id, `has reset the password for ${check[0].username}`);
        
    }
}