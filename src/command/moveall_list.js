const { saveData } = require("../helper/savedata");

async function moveallListTracking(message, trackedUsers, path) {
    if (message.content.startsWith("!moveall list-tracking")){
        // !moveall list-tracking <Destinate Channel ID>
        const parts = message.content.trim().split(/\s+/)
        const newDestinateChannelId = parts[2]
        await message.channel.sendTyping()

        try {
        if (trackedUsers.size > 0) {
            // Duyệt qua tất cả các userId trong trackedUsers và cập nhật destinateChannelId
            trackedUsers.forEach((value, key) => {
                // value là { serverId, destinateChannelId }
                trackedUsers.set(key, { ...value, destinateChannelId: newDestinateChannelId })
            });
            saveData(trackedUsers, path);
        return message.reply("✅ Đã di chuyển hết toàn bộ các UserID chuyển sang kênh đích mới")
    }
    } catch (error) {
        await message.reply("⚠️ Đã xảy ra lỗi khi bạn nhập, vui lòng nhập lại")
        console.error(error)
}
} 
}

module.exports = { moveallListTracking }