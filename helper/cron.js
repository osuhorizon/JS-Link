const cron = require('node-cron');
const user = require('./crons/user.js');
const server = require('./crons/server.js')

async function main(client){
    cron.schedule('* * * * *', async () => {
        //Executed every minute
        await user.verify(client);
        await server.badgePrivileges();
    });
}

module.exports = main