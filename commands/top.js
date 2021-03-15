require("../utils/function")();
module.exports = {
    name: 'top',
    description: "bro i'm a god fr",
    execute(message, args){

        async function topCommand(){

            if(!settings.top){
                message.channel.send("I'm sorry, this command is currently not activated.")
            } else {
    
    
                let member = message.mentions.members.first()
                if (message.mentions.members.size == 1) {
                    mention = true
                } else {
                    mention = false
                }
    
                const arguments = args.join(" ");
                const argument = arguments.split(' ')
    
                const users = [];
                const users2 = [];
                const users3 = [];
                const users4 = [];
    
                if(mention){
                    self = false
                    if(argument[0].toLowerCase() == ("rx" || "relax")){
                        rx = 1
                        rxname = "Relax"
                    } else if(argument[0].toLowerCase() == ("ap" || "autopilot" || "auto")){
                        rx = 2
                        rxname = "Autopilot"
                    } else if(argument[0].toLowerCase() == ("v2" || "scorev2")){
                        rx = 3
                        rxname = "ScoreV2"
                    } else {
                        rx = 0
                        rxname = "Vanilla"
                    }
                    if(argument[0].includes(member.id)){
                        self = false
    
                        const users_data = await new Promise((resolve) => {
    
                            con.query(`SELECT id, username from users WHERE discord_identity = ${member.id} ORDER BY id ASC`, (err, result) => {
            
                                if (err) throw err;
        
                                if(result){
                                resolve(result);
                                }
            
                            });
                        });
            
                        users_data.forEach(rusers => {
            
                            users3.push(rusers)
            
                        });
                        info3 = users3[0]
                        if(users3.length > 0){
                            user = info3.username
                        } else {
                            message.channel.send("The user you mentioned isn't linked yet!")
                        }
    
                    }
    
                } else {
    
                if(argument[0]){
    
                    if(argument[0].toLowerCase() == ("rx" || "relax")){
                        rx = 1
                        rxname = "Relax"
                    } else if(argument[0].toLowerCase() == ("ap" || "autopilot" || "auto")){
                        rx = 2
                        rxname = "Autopilot"
                    } else if(argument[0].toLowerCase() == ("v2" || "scorev2")){
                        rx = 3
                        rxname = "ScoreV2"
                    } else {
                        user = argument[0]
                        rx = 0
                        rxname = "Vanilla"
                    }
    
                } else {
    
                    self = true
                    rx = 0
    
                    const users_data = await new Promise((resolve) => {
    
                        con.query(`SELECT id, username from users WHERE discord_identity = ${message.author.id} ORDER BY id ASC`, (err, result) => {
        
                            if (err) throw err;
    
                            resolve(result);
        
                        });
                    });
        
                    users_data.forEach(rusers => {
        
                        users4.push(rusers)
        
                    });
                    info4 = users4[0]
                    if(users4.length > 0){
                        user = info4.username
                    } else {
                        message.channel.send("Looks like you're not linked yet!")
                    }
    
                }
                    if(argument[0] && !argument[1]){
                        if(argument[0].toLowerCase() == ("rx" || "relax" || "ap" || "auto" || "autopilot" || "v2" || "scorev2")){
                    const users_data = await new Promise((resolve) => {
    
                        con.query(`SELECT id, username from users WHERE discord_identity = ${message.author.id} ORDER BY id ASC`, (err, result) => {
        
                            if (err) throw err;
    
                            resolve(result);
        
                        });
                    });
        
                    users_data.forEach(rusers => {
        
                        users2.push(rusers)
        
                    });
                    info2 = users2[0]
                    if(users2.length > 0){
                        user = info2.username
                    } else {
                        message.channel.send("The user you mentioned isn't linked yet!")
                    }
                    } else {
                        user = argument[0]
                    }
                }
            }
    
                    if(argument[1] && mention){
                        if(argument[1].includes(member.id)){
                            self = false
            
                            const users_data = await new Promise((resolve) => {
            
                                con.query(`SELECT id, username from users WHERE discord_identity = ${member.id} ORDER BY id ASC`, (err, result) => {
                        
                                    if (err) throw err;
                    
                                        resolve(result);
                        
                                });
                            });
                    
                            users_data.forEach(rusers => {
                    
                                users.push(rusers)
                    
                            });
                            info = users[0]
                            if(users.length > 0){
                                user = info.username
                            } else {
                                message.channel.send("The user you mentioned isn't linked yet!")
                            }
            
                        } else {
                            user = argument[1]
                            self = false
                        }
                    } else if(argument[1] && !mention){
                        user = argument[1]
                        self = false
                    }
                if(user || users.length > 0 || users2.length > 0 || users3.length > 0 || users4.length > 0){
                apiurl = `https://${config.api.weburl}/api/v1/users/scores/best?name=${user}&rx=${rx}`
                userapi = `https://${config.api.weburl}/api/v1/users/full?name=${user}`
    
    
                function processRecentData(apidata, index, array) {
                    if (apidata.completed >= 2){
                        if (recentdata.length <= 1){
                        recentdata.unshift(apidata);
                        }
                    }
                }
    
                const recentdata = [];
    
                async function getRecent() {
                    const response = await fetch(apiurl);
                    const data = await response.json();
    
                    const userresponse = await fetch (userapi);
                    const userdata = await userresponse.json();
      
                    did = userdata.id
                    dusername = userdata.username
                    if(data.scores != null){
                    data.scores.forEach(processRecentData);
                    }
                }
    
    
    
                getRecent()
    
                async function getGay(){
                    await getRecent()
    
                    if(recentdata.length > 1){
    
                    yay = "yay"
    
                    dscoreraw = recentdata[1].score
                    dcombo = recentdata[1].max_combo
                    dfc = recentdata[1].full_combo
                    dmod = recentdata[1].mods
                    ddreihundert = recentdata[1].count_300
                    deinhundert = recentdata[1].count_100
                    dfünfzig = recentdata[1].count_50
                    dmiss = recentdata[1].count_miss
                    daccuracy = recentdata[1].accuracy
                    drank = recentdata[1].rank
                    dcompleted = recentdata[1].completed
                    dbeatmapname = recentdata[1].beatmap.song_name
                    dbeatmapid = recentdata[1].beatmap.beatmap_id
                    dbeatmapsetid = recentdata[1].beatmap.beatmapset_id
                    ddifficultyraw = recentdata[1].beatmap.difficulty
                    dppraw = recentdata[1].pp
                    dmaxcombo = recentdata[1].beatmap.max_combo
                    dmaprank = recentdata[1].beatmap.ranked
                    dplayid = recentdata[1].id
    
                    var modsString = ["NF", "EZ", "NV", "HD", "HR", "SD", "DT", "RX", "HT", "NC", "FL", "AU", "SO", "AP", "PF", "K4", "K5", "K6", "K7", "K8", "K9", "RN", "LM", "K9", "K0", "K1", "K3", "K2"];
                    function getScoreMods(e, t) {
                        var n = [];
                        return 512 == (512 & e) && (e &= -65), 16384 == (16384 & e) && (e &= -33), modsString.forEach(function(t, i) {
                            var o = 1 << i;
                        (e & o) > 0 && n.push(t)
                        }), n.length > 0 ? (t ? "" : "+ ") + n.join(", ") : t ? "None" : ""
                    }
    
                    var modsString = getScoreMods(dmod, false);
    
                    function formatNumber(num) {
                        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
                      }
                    dscore = formatNumber(dscoreraw)
    
    
                    ddifficulty = String(ddifficultyraw).substring(0,4)
                    dacc = String(daccuracy).substring(0,5)
                    dpp = String(dppraw).substring(0,6)
    
                    if (dfc){
                        dfullcombo = "(FC)"
                    } else {
                        dfullcombo = ""
                    }
    
                    if(dcompleted == 2){
                        dRanked = "Unranked"
                    } else {
                        dRanked = "Ranked"
                    }
    
    
                    if(dmaprank == 5){
                        dMapRanked = "Loved"
                        dMapRankedLink = "https://x.mxnuuel.de/bot/icons/osu/loved.png"
                    } else if(dmaprank == 4){
                        dMapRanked = "Qualified"
                        dMapRankedLink = "https://x.mxnuuel.de/bot/icons/osu/approved.png"
                    } else if(dmaprank == 3){
                        dMapRanked = "Approved"
                        dMapRankedLink = "https://x.mxnuuel.de/bot/icons/osu/approved.png"
                    } else if(dmaprank == 2){
                        dMapRanked = "Ranked"
                        dMapRankedLink = "https://x.mxnuuel.de/bot/icons/osu/ranked.png"
                    } else {
                        dMapRanked = "Unranked"
                        dMapRankedLink = "https://x.mxnuuel.de/bot/icons/osu/unranked.png"
                    }
    
    
                    line1 = `» [${dbeatmapname}](https://osu.ppy.sh/b/${dbeatmapid}) ${modsString} (★${ddifficulty})`
                    line2 = `\n» ${drank} • ${dcombo}/${dmaxcombo}x ${dfullcombo} • ${dscore} • ${dpp}pp`
                    line3 = `\n» ${dacc}% • [${ddreihundert} • ${deinhundert} • ${dfünfzig} • ${dmiss}]`
                    line4 = `\n» ${dRanked} Score • ${dMapRanked} Map`
    
    
                    if(dRanked == "Ranked"){
                        if(rx == 1){
                            line5 = `\n» [Download Replay](https://lemres.de/web/replays_relax/${dplayid})`
                            } else if(rx == 2){
                                line5 = `\n» [Download Replay](https://lemres.de/web/replays_auto/${dplayid})`
                            } else if(rx == 3){
                                line5 = `\n» [Download Replay](https://lemres.de/web/replays_v2/${dplayid})`
                            } else {
                                line5 = `\n» [Download Replay](https://lemres.de/web/replays/${dplayid})`
                            }
                            DescriptionResult = `${line1}${line2}${line3}${line4}${line5}`
                    } else {
                        DescriptionResult = `${line1}${line2}${line3}${line4}`
                    }
    
                } else {
                    yay = "nay"
                }
                    const userresponse = await fetch (userapi);
                    const userdata = await userresponse.json();
    
                    if(userdata.code != 200){
                        message.channel.send("Couldn't find user.")
                    } else if(yay == "nay"){
                        message.channel.send("No score submitted yet :(")
                    } else {
    
    
    
                        const requestEmbed = new Discord.MessageEmbed()
                        .setColor("#cc99ff")
                        .setAuthor(`Topplay for ${dusername}`, dMapRankedLink)
                        .setDescription(`${DescriptionResult}`)
                        .setThumbnail(`https://${config.api.avatarurl}/${did}`)
                        .setImage(`https://assets.ppy.sh/beatmaps/${dbeatmapsetid}/covers/cover.jpg`)
                        .setTimestamp()
                        .setFooter('Requested by ' + message.author.tag, message.author.avatarURL());
    
                        message.channel.send(requestEmbed);
                    }
                }
    
                getGay()
            }
    
            }
        }
    topCommand()
    }
}