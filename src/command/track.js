const { saveData } = require("../helper/savedata")

async function track(message, trackedUsers, path) {
    // Lệnh để theo dõi người dùng trong 1 server nhất định hoặc global
    if (message.content.startsWith("!track")){
        // !track <User ID> from <Server ID> to <Destinate Channel ID>
        // !track <User ID> from global to <Destinate Channel ID>
        const command = message.content.trim()
        const parts = command.split(/\s+/)
        await message.channel.sendTyping()

        try {
        const userId = parts[1]
        const serverId = parts[3].toLocaleLowerCase()
        const destinateChannelId = parts[5]

        if ( trackedUsers.has(userId) 
            && ((serverId === "global" && trackedUsers.get(userId).serverId === "global") || trackedUsers.get(userId).serverId === serverId)
            && trackedUsers.get(userId).destinateChannelId === destinateChannelId) {  // Từ đối tượng userId lấy destinateChannelId
            await message.reply("⚠️ UserID này đã được theo dõi trước đó, không thể thêm vào nữa.");
        } else {
        // Xử lý serverId là "global" hoặc server cụ thể
        const guildName = serverId === "global" ? "Tất cả server" : (await client.guilds.fetch(serverId)).name

        trackedUsers.set(userId, {serverId, destinateChannelId})
        saveData(trackedUsers, path);
        return message.channel.send(`✅ Đã theo dõi người dùng được chỉ định thành công trong **${guildName}**`)
        }
    } catch (error) {
        await message.reply("⚠️ Đã xảy ra lỗi khi bạn nhập, vui lòng nhập lại")
        console.error(error)
    }
    }
}

async function server_track(message, trackedUsers, client, path) {
    if (message.content.startsWith("!monitor-server")){
        // !monitor-server <Server ID> to <Destinate Channel ID>
        const parts = message.content.trim().split(/\s+/)
        await message.channel.sendTyping()
        try {
            const serverId = parts[1]
            const destinateChannelId = parts[3]

            const guild = await client.guilds.fetch(serverId)
            const guildName = guild.name

            const members = await guild.members.fetch()

            // Thêm tất cả thành viên vào danh sách theo dõi
            members.forEach((member) => {
                if (!member.user.bot) {
                    trackedUsers.set(member.user.id, {
                        serverId: guild.id,
                        destinateChannelId,
                    });
                }
            });
            saveData(trackedUsers, path);
            return message.reply(`✅ Đã theo dõi thành công toàn bộ tất cả thành viên trong **${guildName}**`)
        } catch (error){
            console.error(error)
            await message.reply("⚠️ Đã xảy ra lỗi khi bạn nhập, vui lòng nhập lại")
        }
    }
}

module.exports = { track, server_track }