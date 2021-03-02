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
    client.user.setActivity(config.activity.name , {type: config.activity.type});
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

            var index;

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

                if (privileges == 4){
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
                    });
    
    
                    client.guilds.cache.get(config.gayrizon.id).members.fetch(full.id).then(member => {

                        member.setNickname(`${oop.name}`).catch(error => {
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

});

client.login(config.token);

