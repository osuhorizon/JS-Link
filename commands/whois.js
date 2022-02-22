module.exports = {
    name: 'whois',
    description: "who is this?",
    async execute(message, args){
        const moment = require("moment");
        const { request } = require('../helper/database.js')
        const { checkForUser } = require('../helper/osu.js')

        const check = checkForUser(message, args)

        const user = check.db ? await db.redis.osuGet(`horizon`, check.user) : check.user
        if(user == null) return message.channel.send("The user you are trying to get isn't linked yet!")
        const mode = check.short

        const req = await fetch(`https://lemres.de/api/v1/users/full?name=${user}`)

        const data = await req.json()

        if(data.code != 200) return message.channel.send(`Couldn't find user "${user}"`)

        var onlineResponse = await fetch(`https://c.lemres.de/api/v1/playerstatus?uid=${data.id}`)
        var onlinedata = await onlineResponse.json();

        const { id, username, country, registered, privileges } = data
        const { rank, level, accuracy, pp, playtime, playcount, score, crank } = data[mode]

        const online = onlinedata.Status

        async function whoisCommand(){

            const moment = require ("moment");
            const locale = moment.locale('de');
            const time = moment().format('LTS');
    
            const users = []
    
            const argument = args.join(" ");
    
            let member = message.mentions.members.first()
            if (message.mentions.members.size == 1) {
                mention = true
            } else {
                mention = false
            }
            if(!argument){
                message.channel.send("You have to mention someone")
            } else {
    
                if(mention){
                    if(argument.includes(member.id)){
                        const users_data = await new Promise((resolve) => {
    
                            con.query(`SELECT id, username, discord_identity from users WHERE discord_identity = ${member.id} ORDER BY id ASC`, (err, result) => {
            
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
                            message.channel.send("The you mentioned appears not to be linked")
                        }
                    }
                } else {
                    user = argument
    
                    const users_data = await new Promise((resolve) => {
    
                        con.query(`SELECT id, username, discord_identity from users WHERE username = "${user}" ORDER BY id ASC`, (err, result) => {
        
                            if (err) throw err;
    
                            resolve(result);
        
                        });
                    });
        
                    users_data.forEach(rusers => {
        
                        users.push(rusers)
        
                    });
                    info = users[0]
                }
    
    
            const apiurl = `https://lemres.de/api/v1/users/full?name=${user}`
    
    
            async function getPP() {
                const response = await fetch(apiurl);
                const data = await response.json();
            
                if (data.code != 200) {
    
                    const status = 'failed'
                } else {
    
    
                    async function getOnline() {
    
                        const onlineAPI = `https://c.lemres.de/api/v1/playerstatus?uid=${data.id}`
                        const onlineResponse = await fetch(onlineAPI)
                        const onlinedata = await onlineResponse.json();
    
                    const id = data.id
                    const username = data.username
                    const country = data.country
                    const rank = data.std.global_leaderboard_rank
                    const registered = data.registered_on
                    const level = data.std.level
                    const accuracy = data.std.accuracy
                    const pp = data.std.pp
                    const playtime = data.std.play_time
                    const playcount = data.std.playcount
                    const score = data.std.ranked_score
                    const crank = data.std.country_leaderboard_rank
                    const online = onlinedata.Status
                    const privileges = data.privileges
    
                    if(data.clan.name.length > 1){
                        clan = `[${data.clan.tag}] ${data.clan.name}`
                    } else {
                        clan = `None`
                    }
                    const clanid = data.clan.id
                    const lastlogin = data.latest_activity
    
                    const locale = moment.locale('en');
                    const creg = moment(registered, "YYYY-MM-DDTHH:mm:ss:Z").fromNow();
                    
                    const regyear = registered.substring(0,4)
                    const regmonth = registered.substring(5,7)
                    const regday = registered.substring(8,10)
                    const regtime = registered.substring(11,19)
                    const regdate = regday + "." + regmonth + "." + regyear
    
    
    
                    const logyear = lastlogin.substring(0,4)
                    const logmonth = lastlogin.substring(5,7)
                    const logday = lastlogin.substring(8,10)
                    const logtime = lastlogin.substring(11,19)
                    const logdate = logday + "." + logmonth + "." + logyear
    
                    const acc = String(accuracy).substring(0,5)
    
    
                    if (privileges === 3145727) {
                        
                        userrank = "Administrator"
                        color = "#c589ff"
    
                    } else if (privileges > 2097158 && privileges < 3145727) {
    
                        userrank = "Tournament Staff"
                        color = "#88e45f"
                    } 
                    
                    else if (privileges === 1044475) {
                        
                        userrank = "Developer"
                        color = "#35e4ba"
    
                    } else if (privileges === 1047039) {
    
                        userrank = "Community Manager"
                        color = "#5ac6db"
    
                    } else if (privileges === 786755 ) {
    
                        userrank = "Moderator"
                        color = "#da004e"
    
                    } else if (privileges === 4111 ) {
    
                        userrank = "Content"
                        color = "#e777ff"
    
                    } else if (privileges === 267 ) {
    
                        userrank = "BAT"
                        color = "#ff7520"
    
                    } else if (privileges === 259 ) {
    
                        userrank = "Beatmap Nominator"
                        color = "#e4d84b"
    
                    } else if (privileges === 67 ) {
    
                        userrank = "Supporter"
                        color = "#17ac86"
    
                    } else if (privileges === 7 ) {
    
                        userrank = "Donator"
                        color = "#e4b400"
    
                    } else if (privileges === 3 ) {
    
                        userrank = "Member"
                        color = "#039fff"
    
                    } else if (privileges === 2 ) {
    
                        userrank = "Restricted"
                        color = "#f77231"
    
                    } else if (privileges === 0 ) {
    
                        userrank = "Banned"
                        color = "#880707"
    
                    }
    
                    line1 = `» **Username:**\n[${username}](https://lemres.de/u/${id})\n\n» **ID**:\n${id}`
                    line2 = `\n\n» **Rank:**\n${userrank}`
                    if(clan == 'None'){
                        line3 = `\n\n» **Clan**:\nNone`
                    } else {
                        line3 = `\n\n» **Clan**:\n[${clan}](https://lemres.de/c/${clanid})`
                    }
                    line4 = `\n\n» Registered:\n${regdate} | ${regtime}\n\n» Last Login:\n${logdate} | ${logtime}\n\n» Status: ${online}`
                    if(!mention){
                        if(info.discord_identity.length > 1){
                            line5 = `\n\n» Discord: <@!${info.discord_identity}>`
                        } else {
                            line5 = `\n\n» Discord: Not Linked`
                        }
                        desc = `${line1}${line2}${line3}${line4}${line5}`
                    } else {
                        desc = `${line1}${line2}${line3}${line4}`
                    }
    
    
                    const cplaytime = new Date(playtime * 1000).toISOString().substr(11, 8)
                    const playtimed = Math.floor(playtime / (3600*24));
    
                        if(data.code != 200){
                            message.channel.send("Couldn't find user")
                        } else {
        
                        const requestEmbed = new Discord.MessageEmbed()
                        .setColor(color)
                        .setTitle(`Info for ` + username)
                        .setDescription(desc)
                        .setURL(`https://lemres.de/u/` + id)
                        .setAuthor(username, `https://a.lemres.de/` + id)
                        .setThumbnail(`https://a.lemres.de/`+ id)
                    .setTimestamp()
                    .setFooter('Requested by ' + message.author.tag, message.author.avatarURL());
    
                message.channel.send(requestEmbed);
                        }
    
    
            }         getOnline();
    
        }
    
            }
            getPP();
        }
    
        }    
    whoisCommand()
    }
}