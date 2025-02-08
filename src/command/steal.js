const { fetchLogDataChannelWithTarget } = require("../utilities/fetchdata_target")

async function steal(message, client) {
    if (message.content.startsWith("!steal")) { 
        // !steal 607183227911667746 from 1132656734251520023 to 1313376059030507590
        const command = message.content.trim()
        const parts = command.split(/\s+/)
        await message.channel.sendTyping()

        try {
        const targetId = parts[1]
        const sourceChannelId = parts[3]
        const destinateChannelId = parts[5]

        console.log(`Target ID: ${targetId}`)
        console.log(`Source Channel ID: ${sourceChannelId}`)
        console.log(`Destinate Channel ID: ${destinateChannelId}`)
    
        return fetchLogDataChannelWithTarget(client, message, targetId, sourceChannelId, destinateChannelId);
        } catch (error){
            await message.reply("⚠️ Đã xảy ra lỗi khi bạn nhập, vui lòng nhập lại")
            console.error(error)
        }
    }
}

module.exports = { steal }