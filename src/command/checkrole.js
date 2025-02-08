const { checkRoleInformation } = require("../utilities/checkRoleInformation")

async function checkRole(message){
    if (message.content.startsWith("!role")){
        const parts = message.content.trim().split(/\s+/)
        await message.channel.sendTyping()
        try{
            const roleId = parts[1]
            console.log("ID Role: " + roleId)

            return checkRoleInformation(message, roleId)
        } catch (error){
            console.error(error)
        }
    }
}

module.exports = { checkRole }