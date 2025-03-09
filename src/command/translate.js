const { translateChat } = require("../utilities/translate");

async function translate(message) {
    if (message.content.startsWith("!translate")){
        // !translate vi
        const command = message.content.trim()
        const parts = command.split(/\s+/)
        await message.channel.sendTyping()

        try {
        const sourceMessageId = message.reference?.messageId; // Lấy sourceMessageId bằng cách reply
        const translateSuppose = parts[1]
        if (!translateSuppose){
            await message.reply("Hãy chọn ngôn ngữ phù hợp để dịch")
            return;
        }
        console.log(`Source Message ID: ${sourceMessageId}`)
        console.log(`Language Suppose: ${translateSuppose}`)

        return translateChat(message, sourceMessageId, translateSuppose)
        } catch (error) {
            await message.reply("⚠️ Đã xảy ra lỗi khi bạn nhập, vui lòng nhập lại")
            console.error(error)
        }
    }
}

module.exports = { translate }