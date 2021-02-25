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
    console.log("[" + time + "] " + "Connected as " + client.user.tag);
    client.user.setStatus('online');
    console.log("[" + time + "] " + "Updated Status to: online");
    client.user.setActivity(config.activity.name , {type: config.activity.type});
    console.log("[" + time + "] " + "Updated Activity");
    console.log('-------------------- Stats --------------------')
    console.log("[" + time + "] " + `Uptime: ${uptime}`)
    console.log("[" + time + "] " + `User: ${client.guilds.cache.reduce((a, g) => a + g.memberCount, 0)}`)
    console.log("[" + time + "] " + `Channel: ${client.channels.cache.size}`)
    console.log(`Version: ${version} by Lemres`)


    

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

        con = mysql.createConnection({
            multipleStatements: true,
            host: config.db.host,
            user: config.db.user,
            password: config.db.password,
            database: config.db.database
        });
        
        con.connect(function(err) {
        if (err) throw err;
        console.log(`Connected to ${config.db.database} as ${config.db.user} on ${config.db.host}!`);
    });

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
                role = config.gayrizon.verified.role
                
                con.query(`SELECT username FROM users WHERE discord_identity = ${discordid}`, function(err, result) {
                    if (err) throw err;


                if(result.length > 0){

                    con.query(`DELETE FROM discord_tokens WHERE discord_identity = ${discordid}`, function(err, result) {
                        if (err) throw err;
                    });

                    const target = discordid
                    if(!message.member.roles.cache.has(role)){
                    message.member.roles.add(role)
                    }
                }
            });
                con.end()
            }, duration)
        });
    }

    if (command == 'unlink'){
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
                            con.end()
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

