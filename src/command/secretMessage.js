const { embedSecretMessage } = require("../utilities/embedSecretMessage");

let switchSecretMessage = false

async function secretMessage(message, client){
    try {
        if (message.content.startsWith(">")){
            const parts = message.content.split(/\s+/).trim()
            const userId = parts[1]
            if (!userId){
                await message.reply("Đã có lỗi trong việc nhập, hãy thử lại")
                return;
            }
            console.log("UserID:" + userId)
            switchSecretMessage = !switchSecretMessage
            await message.reply(`Chức năng trò chuyện ẩn danh đã được ${switchSecretMessage ? "bật" : "tắt"}`)
            return embedSecretMessage(message, client, userId)
        }
    } catch (error){
        console.error(error)
        await message.reply("Đã có lỗi phát sinh không mong muốn, vui lòng thử lại")
    }
}

module.exports = { secretMessage }