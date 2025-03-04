const { trackingTranslate } = require("../utilities/trackingTranslate")
let switchTracking = false
let destinateChannelId = null

async function tracking_translate(message, client){
    try {
    if (message.content.startsWith("!trans-watch")){
        const parts = message.content.trim().split(/\s+/)
        destinateChannelId = parts[1]
        switchTracking = !switchTracking
        await message.reply(`Tracking translate đã được ${switchTracking ? "bật" : "tắt"}`)
        }
            // Nếu tracking đang bật, dịch tất cả tin nhắn
            if (switchTracking && !message.content.startsWith("!trans-watch")) {
            return trackingTranslate(message, client, destinateChannelId);
        } 
        } catch (error) {
            await message.reply("⚠️ Đã xảy ra lỗi khi bạn nhập, vui lòng nhập lại")
            console.error(error)
    } 
}

module.exports = { tracking_translate }