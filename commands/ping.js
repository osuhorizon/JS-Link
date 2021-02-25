require("../utils/function")();
module.exports = {
    name: 'ping',
    description: "Pong?",
    execute(message, args){

        async function ping(){
            const moment = require ("moment");
            const locale = moment.locale('de');
            const time = moment().format('LTS');

            const m = await message.channel.send("Pong?");

            // setTimeout(function(){
                m.edit(`Your Ping is ${m.createdTimestamp - message.createdTimestamp}ms`);
            // }, 1000)


            console.log("[" + time + "] " + message.author.tag + ` requested his ping. (${m.createdTimestamp - message.createdTimestamp}ms)`);
        }
        ping();
    }
}