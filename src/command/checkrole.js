const { checkRoleInformation } = require("../utilities/checkRoleInformation")

async function checkRole(message){
    if (message.content.startsWith("!role")){
        const parts = message.content.trim().split(/\s+/)
        await message.channel.sendTyping()
        try{
            const roleId = parts[1]
            if (!roleId){
                await message.reply("Bạn đã nhập sai cú pháp, hãy nhập lại")
                return;
            }
            console.log("ID Role: " + roleId)

            return checkRoleInformation(message, roleId)
        } catch (error){
            console.error(error)
        }
    }
}

module.exports = { checkRole }