const fs = require('fs')

async function restart(message, trackedUsers, path) {
    if (message.content.trim() === "!restart") {
        if (fs.existsSync(path)) {
            const rawData = fs.readFileSync(path, 'utf8');
            const savedData = JSON.parse(rawData);
            trackedUsers.clear();
            savedData.forEach(([userId, info]) => {
                trackedUsers.set(userId, info);
            });
            await message.reply("🔄 Dữ liệu đã được nạp lại thành công!");
        } else {
            await message.reply("⚠️ Không tìm thấy file dữ liệu để nạp lại.");
        }
    }
}

module.exports = { restart }