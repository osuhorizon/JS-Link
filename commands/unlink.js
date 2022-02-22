module.exports = {
    name: 'unlink',
    description: 'unlink to the bot',
    async execute(client, message, args) {
        const { request } = require("../helper/database")

        const user = await request(`SELECT * FROM users WHERE discord_identity = '${message.author.id}'`)
        
        if(user.length == 0) return message.channel.send("You are not linked to the bot")

        await request(`UPDATE users SET discord_identity = '0' WHERE discord_identity = '${message.author.id}'`)

        message.channel.send("You have been unlinked from the bot")
    
    }
}