const { hiddenEmbedLyric } = require("../utilities/hiddenEmbedLyric")

async function hiddenLyric(message){
    try {
        if (message.content.startsWith("!secret"))
            return hiddenEmbedLyric(message)
    } catch (error) {
        console.error(error)
        await message.reply("⚠️ Đã xảy ra lỗi khi bạn nhập, vui lòng nhập lại")
    }
}

module.exports = { hiddenLyric }