const fetch = require('node-fetch')
module.exports = {
    user : {
        get: async function(user, rx, string){
            if(rx == -1) rx = 0
            const mods = ['', 'rx', 'ap', 'v2']
            const request = await fetch(`https://lemres.de/api/v1/users/${mods[rx]}full?${string ? 'name=' : 'id='}${user}`)
            return await request.json()
        }
    }
}