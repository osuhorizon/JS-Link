module.exports = {
    log : async function(admin, text){
        const { request } = require('../helper/database')
        await request(`INSERT INTO rap_logs (userid, text, datetime, through) VALUES ('${admin}', "${text}", '${Math.round(Date.now() / 1000)}', 'Discord')`)
    },

    webhook : async function(embed, type){
        const Discord = require('discord.js')
        const { webhooks } = require('../config.json')
        const webhook = new Discord.WebhookClient(webhooks[`${type}`].id, webhooks[`${type}`].token);

        webhook.send(embed)
    },

    checkPermission : async function(privileges, privilege){

        const check = privilege == 1 ? 1 << 0 : (privilege / 2) << 1

        return (privileges & check) != 0
    },

    note : async function(id, text){
        const { request } = require('../helper/database')

        var date = new Date(Math.round(Date.now()));

        const time = date.toLocaleString()

        const user = await request(`SELECT id, notes FROM users WHERE id = '${id}'`)

        await request(`UPDATE users SET notes = "${user[0].notes}\r\n[${time}] ${text}" WHERE id = '${id}'`)
    },
    checkForUser : async function(message, args){
        const modes = ["std", "taiko", "catch", "mania"]
        const modename = ["Standard", "Taiko", "Catch the Beat", "Mania"]
        
        if(!args[0]) return {db: true, user: message.author.id, mode: "0", modename : modename[0], short: modes[0]}
        
        if(modes.indexOf(args[0]) < 0) modeid = 0
        
        if(message.mentions.members.size > 0){
            return {db: true, user: message.mentions.members.first().user.id, mode: modeid, modename : modename[modeid], short: modes[modeid]}
        } else {
            if(modes.indexOf(args[0]) < 0) return {db: false, user: args[0], mode: modeid, modename : modename[modeid], short: modes[modeid]} 
            if(!args[1]) return {db: true, user: message.author.id, mode: modeid, modename : modename[modeid], short: modes[modeid]} 
            return {db: false, user: args[1], mode: modeid, modename : modename[modeid], short: modes[modeid]} 
        }
    },
    mods : async function(mods){
        var modsString = ["NF", "EZ", "NV", "HD", "HR", "SD", "DT", "RX", "HT", "NC", "FL", "AU", "SO", "AP", "PF", "K4", "K5", "K6", "K7", "K8", "K9", "RN", "LM", "K9", "K0", "K1", "K3", "K2"];
        function getScoreMods(e, t) {
            var n = [];
            return 512 == (512 & e) && (e &= -65), 16384 == (16384 & e) && (e &= -33), modsString.forEach(function(t, i) {
                var o = 1 << i;
            (e & o) > 0 && n.push(t)
            }), n.length > 0 ? (t ? "" : "") + n.join(", ") : t ? "None" : ""
        }

        var modsString = getScoreMods(mods, false);

        return modsString
    }
}