const { request } = require('../database.js')
const { server, settings } = require('../../config.json')

module.exports = {
    verify : async function(client){
        if(!settings.verify) return;
        const users = await request(`SELECT * FROM users WHERE discord_identity != '0'`)
        
        const guild = client.guilds.cache.get(server.id)
    
        for(var i = 0; i < users.length; i++) {
            const user = users[i].discord_identity
            const username = users[i].username
            const privileges = users[i].privileges
            const id = users[i].id
    
            let nickname = ''
    
            if(settings.clan){
                const checkclan = await request(`SELECT clan FROM user_clans WHERE user = ${id}`)
    
                if(checkclan.length == 0){
                    nickname = username
                } else {
                    clan = await request(`SELECT tag FROM clans WHERE id = ${checkclan[0].clan}`)
                    nickname = `[${clan[0].tag}] ${username}`
                }
            } else {
                nickname = username
            }
    
            let error = 0;
    
            const member = await guild.members.fetch(user).catch(async (err) => {
                if(err.code == 10013 || err.code == 10007){
                    error++
                    await request(`UPDATE users SET discord_identity = '0' WHERE discord_identity = '${user}'`)
                }  
            })
    
            if(error) continue;
    
            if(!member.roles.cache.has(server.verified.role)) member.roles.add(server.verified.role)
    
            if((privileges & 2 << 1) != 0){
                if(!member.roles.cache.has(server.donator.role)) member.roles.add(server.donator.role)
            } else {
                if(member.roles.cache.has(server.donator.role)) member.roles.remove(server.donator.role)
            }
    
            if(!settings.rename) continue;
    
            if(user != server.owner) member.setNickname(`${nickname}`)
    
            if(error) continue;
        }
    }
}