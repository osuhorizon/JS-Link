module.exports = {
    name: 'map',
    description: 'decide the rank of a beatmap',
    async execute(client, message, args) {
        const { request } = require("../helper/database");
        const { log, checkPermission, webhook } = require("../helper/osu");
        const Discord = require("discord.js");

        const admin = await request(`SELECT id, username, privileges FROM users WHERE discord_identity = '${message.author.id}'`)

        if(admin.length == 0) return message.channel.send("You are not linked to the bot")

        if(!checkPermission(admin[0].privileges, 256)) return message.channel.send("You are not allowed to use this command")

        if(!args[2]) return message.channel.send("Invalid Arguments");

        if(isNaN(args[2])) return message.channel.send("Invalid Arguments");

        const rank = args[0]

        if(rank == "unrank"){
            rankID = 0
            status = "unranked"
            colortype = 0x696969
        }else if(rank == "rank"){
            rankID = 2
            status = "ranked"
            colortype = 0xcceeff
        }else if(rank == "qualify"){
            rankID = 4
            status = "qualifed"
            colortype = 0xffffcc
        }else if(rank == "love"){
            rankID = 5
            status = "loved"
            colortype = 0xffccdc
        } else {
            return message.channel.send("Invalid Arguments")
        }

        if(args[1] != "map" && args[1] != "set") return message.channel.send("Invalid Arguments");

        const beatmap = await request(`SELECT id, beatmap_id, beatmapset_id, ranked, song_name FROM beatmaps WHERE beatmap_id = '${args[2]}'`);

        if(beatmap.length == 0) return message.channel.send("That beatmap does not exist");

        if(beatmap[0].ranked == rankID) return message.channel.send(`That beatmap is already ${status}`);
        
        await request(`UPDATE beatmaps SET ranked = '${rankID}' WHERE ${args[1] == "map" ? "beatmap_id" : "beatmapset_id"} = '${args[1] == "map" ? beatmap[0].beatmap_id :  beatmap[0].beatmapset_id}'`);
        
        await log(admin[0].id, `has ${status} beatmap ${args[1] == "map" ? "(map)" : "(set)"}: ${beatmap[0].song_name} (${args[2]})`);

        const embed = new Discord.MessageEmbed()
        .setColor(colortype)
        .setAuthor(`${admin[0].username}`, `https://a.lemres.de/${admin[0].id}`)
        .setTitle(`New ${status} map!`)
        .setURL(`https://lemres.de/b/${beatmap[0].beatmap_id}`)
        .setDescription(`${args[1] == 'set' ? "the set of" : ""} ${beatmap[0].song_name} has been ${status}`)
        .setImage(`https://assets.ppy.sh/beatmaps/${beatmap[0].beatmapset_id}/covers/cover.jpg`)
        .setFooter(`Ranked via Discord by ${admin[0].username}`)

        await webhook(embed, "beatmap")

        message.channel.send(`Sucessfully ${status} ${beatmap[0].song_name}`)
    }
}