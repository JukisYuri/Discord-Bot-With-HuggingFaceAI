const { checkUserInformation } = require("../utilities/checkUserInformation")

async function checkUser(message) {
    if (message.content.startsWith("!user")){
        const parts = message.content.trim().split(/\s+/)
        await message.channel.sendTyping()
        try {

        const userId = parts[1]
        console.log(userId)

        return checkUserInformation(message, userId)
        } catch (error) {
            console.error(error)
        }
    }
}

module.exports = { checkUser }