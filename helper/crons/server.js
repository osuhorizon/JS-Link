const { request } = require('../database.js')
const { checkPermission } = require('../osu.js')
module.exports = {
    badgePrivileges : async function(){
        const users = await request(`SELECT * FROM users WHERE privileges != '2' AND privileges != '1' AND privileges != '1048576'`)

        for(var i = 0; i < users.length; i++) {
            const user = users[i]
            const privileges = user.privileges
            const id = user.id

            if(checkPermission(privileges, 4)){
                await request(`UPDATE users_stats SET can_custom_badge = '1' WHERE id = '${id}'`)
            } else {
                await request(`UPDATE users_stats SET can_custom_badge = '0' WHERE id = '${id}'`)
            }
        }
    }
}