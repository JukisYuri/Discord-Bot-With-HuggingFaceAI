require('dotenv').config()
const { Client, GatewayIntentBits, ActivityType } = require('discord.js')
const { tutorialForUsingBot, tutorialUse, informationAuthor, informationBot } = require('./src/tutorial.js')
const { prompt } = require('./src/AI_prompt.js')
const { fetchLogDataChannel } = require('./src/utilities/fetchdata.js')
const { fetchLogDataChannelWithTarget } = require('./src/utilities/fetchdata_target.js')
const { translateChat } = require('./src/utilities/translate.js')
const tracker = require('./src/utilities/tracker.js');
const { splitMessage } = require('./src/helper/split_message.js')
const { convertMP3 } = require('./src/utilities/convertmp3_youtube.js')
const { saveData, setupAutoSave } = require('./src/helper/savedata.js')

const fs = require('fs')
const path = './src/data/trackedUsers.json';  // file lưu dữ liệu

//---------------------------------------------------------------

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers],
})

const trackedUsers = new Map() // Khai báo quan trọng nhất của track
// Load dữ liệu, nếu trống thì bỏ qua
if (fs.existsSync(path)) {
    const rawData = fs.readFileSync(path, 'utf8');

    // Nếu file trống thì bỏ qua không parse
    if (rawData.trim().length > 0) {
        try {
            const savedData = JSON.parse(rawData);
            savedData.forEach(([userId, info]) => {
                trackedUsers.set(userId, info);
            });
            console.log('✅ Dữ liệu đã được nạp lại từ file trackedUsers.json');
        } catch (err) {
            console.error('❌ Lỗi khi phân tích file trackedUsers.json:', err.message);
        }
    } else {
        console.log('⚠️ File trackedUsers.json trống, chưa có dữ liệu để nạp.');
    }
} else {
    console.log('📂 Chưa có file trackedUsers.json. Dữ liệu sẽ được tạo khi bạn dùng !track.');
}


client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setActivity('Happy Lunar New Year', { type: ActivityType.Watching })
    setupAutoSave(trackedUsers, path); // Mỗi lần ready, sẽ nạp vào từ folder data
})

//---------------------------------------------------------------

const authorId = "607183227911667746"
tracker(client, trackedUsers)
let verificationCode

//-------------------------------------------------------------

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

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

    if (message.content.startsWith("!help")){
        await message.channel.sendTyping()
        return tutorialForUsingBot(message) // vì bên kia reply nên truyền đối tượng message, ko phải message.content
    }

    if (message.content.startsWith("!cách dùng")){
        await message.channel.sendTyping()
        return tutorialUse(message)
    }

    if (message.content.startsWith("!thông tin chủ bot")){
        await message.channel.sendTyping()
        return informationAuthor(message)
    }

    if (message.content.startsWith("!thông tin về con bot")){
        await message.channel.sendTyping()
        return informationBot(message)
    }

    if (message.content.startsWith("!steal")) { 
        // !steal 607183227911667746 from 1132656734251520023 to 1313376059030507590
        const command = message.content.trim()
        const parts = command.split(/\s+/)
        await message.channel.sendTyping()

        try {
        const targetId = parts[1]
        const sourceChannelId = parts[3]
        const destinateChannelId = parts[5]

        console.log(`Target ID: ${targetId}`)
        console.log(`Source Channel ID: ${sourceChannelId}`)
        console.log(`Destinate Channel ID: ${destinateChannelId}`)
    
        return fetchLogDataChannelWithTarget(client, message, targetId, sourceChannelId, destinateChannelId);
        } catch (error){
            await message.reply("⚠️ Đã xảy ra lỗi khi bạn nhập, vui lòng nhập lại")
            console.error(error)
        }
    }

    if (message.content.startsWith("!fetch")){
        // !fetch 1132656734251520023 to 1313376059030507590
        const command = message.content.trim()
        const parts = command.split(/\s+/)
        await message.channel.sendTyping()

        try {
        const sourceChannelId = parts[1]
        const destinateChannelId = parts[3]

        if (sourceChannelId == undefined || destinateChannelId == undefined){
            await message.reply("⚠️ Kiểu dữ liệu nhập vào không hợp lệ, vui lòng nhập lại")
        }
        console.log(`Source Channel ID: ${sourceChannelId}`);
        console.log(`Destinate Channel ID: ${destinateChannelId}`);

        return fetchLogDataChannel(client, message, sourceChannelId, destinateChannelId)
    } catch (error) {
        await message.reply("⚠️ Đã xảy ra lỗi khi bạn nhập, vui lòng nhập lại")
        console.error(error)
    }
    }

    if (message.content.startsWith("!translate")){
        // !translate vi
        const command = message.content.trim()
        const parts = command.split(/\s+/)
        await message.channel.sendTyping()

        try {
        const sourceMessageId = message.reference?.messageId; // Lấy sourceMessageId bằng cách reply
        const translateSuppose = parts[1]
        console.log(`Source Message ID: ${sourceMessageId}`)
        console.log(`Language Suppose: ${translateSuppose}`)

        return translateChat(message, sourceMessageId, translateSuppose)
        } catch (error) {
            await message.reply("⚠️ Đã xảy ra lỗi khi bạn nhập, vui lòng nhập lại")
            console.error(error)
        }
    }

    if (message.content.startsWith("!audio")){
        // !audio
        await message.channel.sendTyping()

        try {
            if (message.reference?.messageId){
            const referenceMessage = await message.channel.messages.fetch(message.reference.messageId)
            const sourceLink = referenceMessage.content.trim()
            console.log(`Source Video: ${sourceLink}`)
            return convertMP3(sourceLink, message)
            }
        } catch (error) {
            await message.reply("⚠️ Đã xảy ra lỗi khi bạn nhập, vui lòng nhập lại")
            console.error(error)
        }
    }

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
        try{
            if (trackedUsers.size > 0){
                let trackingList = "📋 **Danh sách người dùng đang bị theo dõi (Visual):**\n"
                for (const [key, value] of trackedUsers.entries()){
                    const user = await message.client.users.fetch(key)
                    let guild = ''
                    value.serverId === "global" ?
                        guild = "Global (All Server)" :
                        guild = message.client.guilds.cache.get(value.serverId)

                    const destinateChannel = await message.client.channels.fetch(value.destinateChannelId)

                    trackingList += `- __User:__ ${user.username} | __Server:__ ${guild} | __DestinateChannel:__ ${destinateChannel}\n`
                }
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

    // Lệnh để hủy theo dõi người dùng
    if (message.content.startsWith("!untrack")) {
        // !untrack <User ID>
        const command = message.content.trim()
        const parts = command.split(/\s+/)
        await message.channel.sendTyping()

        try {
        const userId = parts[1]
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

    try {
        if(message.content.startsWith("! ")){
            return prompt(message)
    } else {
        return;
    }
} catch (error) {
    console.error(error.message)
    await message.reply("⚠️ Đã có vấn đề trong đoạn mã bạn đang viết")
}
})

client.login(process.env.BOT_TOKEN)