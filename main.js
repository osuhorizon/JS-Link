const Discord = require('discord.js')
const recursive = require('recursive-readdir')
const moment = require('moment')
const { connect } = require('./helper/database.js')
const cron = require('./helper/cron.js')
const { prefix, token } = require(`./config.json`)

const client = new Discord.Client();

const locale = moment.locale('en');
const uptime = moment().format('LLL');

client.commands = new Discord.Collection();

recursive("commands/", function(err, files){
    files.forEach(commands => {
        var filesName = "./" + commands
        const command = require(filesName)
        client.commands.set(command.name, command);
    });
})

client.on('ready', async () => {
    await connect();
    cron(client);
});

client.on('message', async message => {
    
    //commands
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    let cmdToExecute = client.commands.get(command);

    if(cmdToExecute){
        cmdToExecute.execute(client, message, args);
    }

});

client.login(token);