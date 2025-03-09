const { saveData } = require("../helper/savedata")

async function untrack(message, trackedUsers, path) {
    // Lệnh để hủy theo dõi người dùng
    if (message.content.startsWith("!untrack")) {
        // !untrack <User ID>
        const command = message.content.trim()
        const parts = command.split(/\s+/)
        await message.channel.sendTyping()

        try {
        const userId = parts[1]
        if (!userId){
            await message.reply("Bạn đã nhập sai cú pháp, hãy nhập lại")
            return;
        }
        console.log(`User ID cần xóa: ${userId}`)
        if (trackedUsers.has(userId)) {
            trackedUsers.delete(userId)
            await message.reply(`✅ Đã hủy theo dõi người dùng ${userId}`);
        } else {
            await message.reply(`⚠️ Không tìm thấy người dùng ${userId} trong danh sách theo dõi.`);
        }
        saveData(trackedUsers, path);
    } catch {
        await message.reply("⚠️ Đã xảy ra lỗi khi bạn nhập, vui lòng nhập lại")
        console.error(error)
    }
}   
}

module.exports = { untrack }