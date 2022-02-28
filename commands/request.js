module.exports = {
    name: 'request',
    description: "OMG DID YOU SEE THAT SCORE? Horizon Edition",
    async execute(client, message, args){
        const moment = require('moment')
        const { request } = require('../helper/database')
        const convertMods = require('../helper/osu').mods
        const api = require('../helper/api')
        const { getChannel } = require('../helper/discord')
        const { MessageEmbed } = require('discord.js')
        const mods = ['', 'rx', 'ap', 'v2']
        const modes = ['std', 'taiko', 'ctb', 'mania']

        const mod = mods.indexOf(args[0].toLowerCase())
        const replayID = mod == -1 ? args[0] : args[1]
        if(isNaN(replayID) || !isFinite(replayID)) return message.channel.send("Please provide a valid replay id!")

        const mode = mod == -1 ? "Vanilla" : mod == 1 ? "Relax" : mod == 2 ? "AutoPilot" : "ScoreV2"
        const table = mod == -1 ? "scores" : mod == 1 ? "scores_relax" : mod == 2 ? "scores_ap" : "scores_v2"
        const replays = mod == -1 ? "replays" : mod == 1 ? "replays_relax" : mod == 2 ? "replays_auto" : "replays_v2"

        const score = await request(`SELECT * FROM ${table} WHERE id = "${replayID}"`)
        if(!score.length > 0) return message.channel.send("Replay not found. Did you select the right mod?")

        const gamemode = score[0].play_mode
        const fc = score[0].fc == 1 ? ' (FC)' : ''

        const submitted = moment(score[0].time * 1000).fromNow()
        const modString = await convertMods(score[0].mods)

        const beatmap = await request(`SELECT * FROM beatmaps WHERE beatmap_md5 = "${score[0].beatmap_md5}"`)
        if(beatmap.length < 1) return message.channel.send("Something went wrong analyzing the beatmap")
        const ranked = beatmap[0].ranked == 2 ? 'Ranked' : beatmap[0].ranked == 3 ? 'Approved' : beatmap[0].ranked == 4 ? 'Qualified' : beatmap[0].ranked == 5 ? 'Loved' : 'Unranked'

        const description = `
        » Mods: ${modString}
        » Stats: ${score[0].max_combo}/${beatmap[0].max_combo}x${fc} • ${score[0].pp.toFixed(2)}pp
        » Accuracy: ${score[0].accuracy.toFixed(2)}% • [${score[0]["300_count"]} • ${score[0]["100_count"]} • ${score[0]["50_count"]} • ${score[0].misses_count}]
        » ${ranked} Map
        » Submitted ${submitted}
        » [Download Replay](https://lemres.de/web/${replays}/${replayID})`

        const user = await api.user.get(score[0].userid, mod)

        if(user.message == "That user could not be found!") return message.channel.send("This user is restricted, sorry.")
        if(user[modes[gamemode]].global_leaderboard_rank == null) return message.channel.send("The user you requested is currently not ranked in!")
        
        const embed = new MessageEmbed()
        .setAuthor(`Request to upload by ${user.username} (${mode} #${user[modes[gamemode]].global_leaderboard_rank})`, `https://a.lemres.de/${score[0].userid}`)
        .setTitle(beatmap[0].song_name)
        .setURL(`https://lemres.de/b/${beatmap[0].beatmap_id}`)
        .setDescription(description)
        .setColor('BLUE')
        .setImage(`https://assets.ppy.sh/beatmaps/${beatmap[0].beatmapset_id}/covers/cover.jpg`)
        .setTimestamp()
        .setFooter('Requested by ' + message.author.tag, message.author.avatarURL());

        const requestChannel = await getChannel(message, 'upload-request')

        requestChannel.send(embed).then(async function(message){
            await message.react('👍')
            await message.react('👎')
        })

        message.channel.send("You successfully submitted a replay :)")
    }
}