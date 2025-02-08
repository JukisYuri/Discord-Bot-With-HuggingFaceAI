const { saveData } = require("../helper/savedata")

async function resetListTracking(message, trackedUsers, path) {
    if (message.content.startsWith("!reset list-tracking")){
        // !reset list-tracking
        await message.channel.sendTyping()
        try {
        if (trackedUsers.size > 0){
            trackedUsers.clear()
            saveData(trackedUsers, path)
            return message.reply("✅ Đã xoá hết dữ liệu trong list-tracking")
        } else {
            return message.reply("⚠️ Không có dữ liệu nào được tìm thấy")
        }
    } catch (error){
        await message.reply("⚠️ Đã xảy ra lỗi khi bạn nhập, vui lòng nhập lại")
        console.error(error)
    }
    }
}

module.exports = { resetListTracking }