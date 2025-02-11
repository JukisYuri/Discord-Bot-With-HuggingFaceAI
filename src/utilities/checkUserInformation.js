const { splitMessage } = require("../helper/split_message")

async function checkUserInformation(message, userId) {
    try {
        let user = await message.client.users.fetch(userId, { force: true });

        // Lấy avatar, banner, avatar decoration
        const formatedAvt = user.avatarURL({ dynamic: true, size: 4096}) || "không có"
        const formatedBanner = user.bannerURL({ dynamic: true, size: 4096}) || "không có"
        const formatedAvtDeco = user.avatarDecorationURL({ dynamic: true, size: 4096}) || "không có"
        // const formatedJSONData = user.toJSON() || "không rõ"

        const userInfor = `**📇 Thông tin người dùng:**\n` +
        `**Người dùng:** ${user.username}\n` +
        `**ID:** ${user.id}\n` +
        `**Tên công khai:** ${user.globalName}\n` +
        `**Ngày được tạo:** ${user.createdAt.toLocaleDateString("vi-VN")}\n` +
        `**Đã được cache dữ liệu:** ${user.partial ? 'có' : 'không'}\n` +
        `**Có phải là bot:** ${user.bot ? 'có' : 'không'}\n` +
        `**Avatar Decorate:** ${formatedAvtDeco}\n` +
        `**Avatar:** ${formatedAvt}\n` +
        `**Banner:** ${formatedBanner}\n`
        // `**JSON Data:** \`\`\`json\n${JSON.stringify(formatedJSONData, null, 2)}\n\`\`\``

        const formatedInfo = splitMessage(userInfor)
        for (const chunk of formatedInfo){
            await message.reply(chunk)
        }
    } catch (err) {
        console.error(err)
        await message.reply('❌ Đã xảy ra lỗi khi nhập')
    }
}

module.exports = { checkUserInformation }