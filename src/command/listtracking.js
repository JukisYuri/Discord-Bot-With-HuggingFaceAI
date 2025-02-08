const { splitMessage } = require("../helper/split_message");
let verificationCode
const authorId = "607183227911667746"
async function listTracking(message, trackedUsers) {
    if (message.content.startsWith("!list-tracking")){
        // !list-tracking
        await message.channel.sendTyping()
        try {
        if (trackedUsers.size > 0){
            let trackingList = "📋 **Danh sách người dùng đang bị theo dõi:**\n"
            trackedUsers.forEach((value, key) => {
                trackingList += `- UserID: ${key}, ServerID: ${value.serverId}, DestinateChannelID: ${value.destinateChannelId}\n`;
            })
            const splitTracked = splitMessage(trackingList)
            for (const chunk of splitTracked){
                await message.reply(chunk)
            }
        } else {
            return message.reply("⚠️ Không có người nào được track")
        }
    } catch (error){
        await message.reply("⚠️ Đã xảy ra lỗi khi bạn nhập, vui lòng nhập lại")
        console.error(error)
    }
    }
}

async function visualListTracking(message, trackedUsers, client) {
    if (message.content.startsWith("!visual list-tracking")){
            // !visual list-tracking
            const author = await client.users.fetch(authorId)
            verificationCode = Math.floor(10000 + Math.random() * 90000).toString()
            // Gửi mã xác minh qua DM
            if (author) {
                try {
                    await author.send(`Mã xác minh của chủ nhân là: **${verificationCode}**`);
                    await message.reply("Mã xác minh đã được gửi vào DM của Author. Hãy kiểm tra và nhập mã dưới phần chat của em")
                } catch (error) {
                    console.error("Không thể gửi tin nhắn DM:", error);
                    return message.reply("⚠️ Không thể gửi mã xác minh qua DM. Vui lòng thử lại.");
                }
            } else {
                return message.reply("⚠️ Không tìm thấy tài khoản của chủ nhân.");
            }
        } else if (verificationCode && message.content === verificationCode) {
            try {
                if (trackedUsers.size > 0) {
                    const header = "📋 **Danh sách người dùng đang bị theo dõi (Visual):**\n\n";
                    // Tạo một object để nhóm kết quả theo khóa (server và channel)
                    const groups = {};
        
                    // Tạo mảng Promise fetch dữ liệu cho từng mục
                    const promises = Array.from(trackedUsers.entries()).map(async ([userId, info]) => {
                        // Lấy thông tin user
                        const user = await message.client.users.fetch(userId);
                        // Lấy tên server: nếu "global" thì dùng chuỗi cố định, nếu không thì lấy từ cache/fetch
                        let guildName;
                        if (info.serverId === "global") {
                            guildName = "Global (All Server)";
                        } else {
                            const guild = message.client.guilds.cache.get(info.serverId) || await message.client.guilds.fetch(info.serverId);
                            guildName = guild.name;
                        }
                        // Fetch channel đích và lấy tên channel
                        const destChannel = await message.client.channels.fetch(info.destinateChannelId);
                        const destChannelName = destChannel.name;
        
                        // Tạo khóa nhóm cho từng mục (có thể sử dụng format khác nếu muốn)
                        const key = `☪ **Server:** ${guildName}, **DestinateChannel:** ${destChannelName}`;    
                        // Định dạng mục cho từng user
                        const entry = `- ${user.username} ➟ ${user.id}\n`;
        
                        return { key, entry };
                    });
        
                    // Đợi tất cả Promise hoàn thành
                    const results = await Promise.all(promises);
        
                    // Nhóm các entry theo khóa
                    results.forEach(({ key, entry }) => {
                        if (!groups[key]) groups[key] = "";
                        groups[key] += entry;
                    });
        
                    // Tạo chuỗi kết quả cuối cùng
                    let finalOutput = header;
                    for (const groupKey in groups) {
                        finalOutput += groupKey + "\n" + groups[groupKey] + "\n";
                    }
        
                    // Nếu chuỗi quá dài thì chia nhỏ
                    const splitTracked = splitMessage(finalOutput);
                    for (const chunk of splitTracked) {
                        await message.reply(chunk);
                    }
                } else {
                    return message.reply("⚠️ Không có người nào được track");
                }
            } catch (error) {
                await message.reply("⚠️ Đã xảy ra lỗi khi bạn nhập, vui lòng nhập lại");
                console.error(error);
            }
        }
}

module.exports = { listTracking, visualListTracking }