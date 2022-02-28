module.exports = {
    getChannel: async function(message, channel){
        const search = message.guild.channels.cache.find(c => c.name === channel)
        return search
    }
}