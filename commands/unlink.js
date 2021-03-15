require("../utils/function")();
module.exports = {
    name: 'whois',
    description: "owo?",
    execute(message, args){

        async function unlinkCommand(){

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
    unlinkCommand()
    }
}