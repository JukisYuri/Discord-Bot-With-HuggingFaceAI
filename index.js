require('dotenv').config()
const { Client, GatewayIntentBits, ActivityType } = require('discord.js')
const { tutorialForUsingBot, tutorialUse, informationAuthor, informationBot } = require('./src/tutorial.js')
const { prompt } = require('./src/AI_prompt.js')
const { fetchLogDataChannel } = require('./src/utilities/fetchdata.js')
const { fetchLogDataChannelWithTarget } = require('./src/utilities/fetchdata_target.js')
const { translateChat } = require('./src/utilities/translate.js')
const tracker = require('./src/utilities/tracker.js');

//-------------------------------------------------------------

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setActivity('đoạn mã thiểu năng đang được viết', { type: ActivityType.Watching });
});

const trackedUsers = new Map() 
tracker(client, trackedUsers);
client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    
    if (message.content.startsWith("! help")){
        await message.channel.sendTyping()
        return tutorialForUsingBot(message) // vì bên kia reply nên truyền đối tượng message, ko phải message.content
    }

    if (message.content.startsWith("! cách dùng")){
        await message.channel.sendTyping()
        return tutorialUse(message)
    }

    if (message.content.startsWith("! thông tin chủ bot")){
        await message.channel.sendTyping()
        return informationAuthor(message)
    }

    if (message.content.startsWith("! thông tin về con bot")){
        await message.channel.sendTyping()
        return informationBot(message)
    }

    if (message.content.startsWith("! steal")) { 
        // ! steal 607183227911667746 from 1132656734251520023 to 1313376059030507590
        const command = message.content.trim();
        const parts = command.split(' ');
    
        const targetId = parts[2]; 
        const sourceChannelId = parts[4]; 
        const destinateChannelId = parts[6]; 
        console.log(`Target ID: ${targetId}`);
        console.log(`Source Channel ID: ${sourceChannelId}`);
        console.log(`Destinate Channel ID: ${destinateChannelId}`);
    
        await message.channel.sendTyping();
        return fetchLogDataChannelWithTarget(client, message, targetId, sourceChannelId, destinateChannelId);
    }

    if (message.content.startsWith("! fetch")){
        // ! fetch 1132656734251520023 to 1313376059030507590
        const command = message.content.trim()
        const parts = command.split(' ');

        const sourceChannelId = parts[2]
        const destinateChannelId = parts[4]
        console.log(`Source Channel ID: ${sourceChannelId}`);
        console.log(`Destinate Channel ID: ${destinateChannelId}`);

        await message.channel.sendTyping()
        return fetchLogDataChannel(client, message, sourceChannelId, destinateChannelId)
    }

    if (message.content.startsWith("! translate")){
        // ! translate vi
        const command = message.content.trim()
        const parts = command.split(' ');

        const sourceMessageId = message.reference?.messageId; // Lấy sourceMessageId bằng cách reply
        const translateSuppose = parts[2]
        console.log(`Source Message ID: ${sourceMessageId}`)
        console.log(`Language Suppose: ${translateSuppose}`)

        await message.channel.sendTyping()
        return translateChat(message, sourceMessageId, translateSuppose)
    }

    // Lệnh để theo dõi người dùng trong 1 server nhất định
    if (message.content.startsWith("! track")){
        // ! track <User ID> from <Server ID> to <Destinate Channel ID>
        const command = message.content.trim()
        const parts = command.split(' ');

        const userId = parts[2]
        const serverId = parts[4]
        const destinateChannelId = parts[6]
        await message.channel.sendTyping()
        if (trackedUsers.has(userId) && trackedUsers.has(serverId) && trackedUsers.has(destinateChannelId)){
            await message.reply("UserID này đã có từ trước, không thể thêm vào nữa")
            return;
        } else {
        const guildName = await client.guilds.fetch(serverId)
        trackedUsers.set(userId, {serverId, destinateChannelId})
        return message.channel.send(`Đã theo dõi người dùng được chỉ định thành công trong server **${guildName}**`)
        }
    }

    if (message.content.startsWith("! list-tracking")){
        // ! list-tracking
        await message.channel.sendTyping()
        if (trackedUsers.size > 0){
            let trackingList = "**Danh sách người dùng theo dõi:**\n"
            trackedUsers.forEach((value, key) => {
                trackingList += `- UserID: ${key}, ServerID: ${value.serverId}, DestinateChannelID: ${value.destinateChannelId}\n`;
            })
            return message.reply(trackingList)
        } else {
            return message.reply("Không có người nào được track")
        }
    }

    if (message.content.startsWith("! reset list-tracking")){
        await message.channel.sendTyping()
        if (trackedUsers.size > 0){
            trackedUsers.clear()
            return message.reply("Đã xoá hết dữ liệu trong list-tracking")
        } else {
            return message.reply("Không có dữ liệu nào được tìm thấy")
        }
    }

    // Lệnh để hủy theo dõi người dùng
    if (message.content.startsWith("! untrack")) {
        // ! untrack <User ID>
        const command = message.content.trim()
        const parts = command.split(' ')

        const userId = parts[2];
        console.log(`User ID cần xóa: ${userId}`)
        if (trackedUsers.has(userId)) {
            trackedUsers.delete(userId)
            await message.channel.sendTyping()
            await message.reply(`Đã hủy theo dõi người dùng <@${userId}>.`);
        } else {
            await message.channel.sendTyping()
            await message.reply(`Không tìm thấy người dùng <@${userId}> trong danh sách theo dõi.`);
        }
        return;
    }

    try {
        if(message.content.startsWith("! ")){
            return prompt(message)
    } else {
        return;
    }
} catch (error) {
    console.log(error.message)
    await message.reply("Đã có vấn đề trong đoạn mã bạn đang viết")
}
})

client.login(process.env.BOT_TOKEN)