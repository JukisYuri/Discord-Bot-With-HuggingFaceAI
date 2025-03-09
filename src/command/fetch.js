const { fetchLogDataChannel } = require("../utilities/fetchdata")


async function fetchLog(message, client) {
    if (message.content.startsWith("!fetch")){
        // !fetch 1132656734251520023 to 1313376059030507590
        const command = message.content.trim()
        const parts = command.split(/\s+/)
        await message.channel.sendTyping()

        try {
        const sourceChannelId = parts[1]
        const destinateChannelId = parts[3]
        if (!sourceChannelId || !destinateChannelId){
            await message.reply("Bạn đã nhập sai cú pháp, hãy nhập lại")
            return;
        }
        console.log(`Source Channel ID: ${sourceChannelId}`);
        console.log(`Destinate Channel ID: ${destinateChannelId}`);

        return fetchLogDataChannel(client, message, sourceChannelId, destinateChannelId)
    } catch (error) {
        await message.reply("⚠️ Đã xảy ra lỗi khi bạn nhập, vui lòng nhập lại")
        console.error(error)
    }
    }
}

module.exports = { fetchLog }