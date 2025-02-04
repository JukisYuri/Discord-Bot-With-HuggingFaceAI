const { sendAttachment } = require("../helper/attachment");
const { preventMention, preventMentionRole, preventMentionEveryone } = require("../helper/prevent_mentions_users");

let ghostMode = false
module.exports = (client, trackedUsers) => {
    client.on('messageCreate', async (message) => {
        if (message.content.trim() === "!shortened"){
            ghostMode = !ghostMode
            return message.reply(`Shorten Mode đã được ${ghostMode ? "bật" : "tắt"}. Các log sau đây sẽ ${ghostMode ? "được rút gọn" : "đầy đủ"}.`)
        }

        // Kiểm tra nếu user đang bị theo dõi
        const trackedInfo = trackedUsers.get(message.author.id)

        if (
            trackedInfo &&
            (trackedInfo.serverId === "global" || message.guild.id === trackedInfo.serverId) &&
            !message.author.bot 
        ) {
            try {
                const destinateChannel = await client.channels.fetch(trackedInfo.destinateChannelId)
                preventMention(message)
                preventMentionRole(message)
                preventMentionEveryone(message)
                // logMessage tùy thuộc vào serverId
                let logMessage = ""
                if (message.reference?.messageId){
                    const referenceMessage = await message.channel.messages.fetch(message.reference.messageId)
                    logMessage += `***${message.author.username}*** *replying to* ***${referenceMessage.author.username}: ${referenceMessage.content || "[No Content]"}***\n`
                }
                if (ghostMode){
                    logMessage +=
                            trackedInfo.serverId === "global"
                                    ? `__GB__ **${message.author.username}**: ${message.content}\n`
                                    : `**${message.author.username}**: ${message.content}\n`
                    logMessage += sendAttachment(message)
                } else {
                        logMessage +=
                            trackedInfo.serverId === "global"
                                    ? `__GB__ [${message.createdAt.toLocaleString("vi-VN", {
                                          timeZone: "Asia/Ho_Chi_Minh",
                                      })} | ${message.guild.name} | ${message.channel.name}] **${message.author.username}**: ${message.content}\n`
                                    : `[${message.createdAt.toLocaleString("vi-VN", {
                                          timeZone: "Asia/Ho_Chi_Minh",
                                      })} | ${message.guild.name} | ${message.channel.name}] **${message.author.username}**: ${message.content}\n`
                    logMessage += sendAttachment(message)
                }
                const sentMessage = await destinateChannel.send(logMessage)

                // Track thêm thông tin về server và channel hiện tại của người bị theo dõi
                trackedInfo.lastMessageId = sentMessage.id; // ID của tin nhắn log bot đã gửi
                trackedInfo.lastGuildId = message.guild.id; // ID của server người bị track đang hoạt động
                trackedInfo.lastChannelId = message.channel.id; // ID của kênh người bị track đang hoạt động
                trackedInfo.lastOriginalMessageId = message.id; // ID của tin nhắn gốc mà người bị theo dõi gửi

            } catch (error) {
                console.error('Lỗi khi gửi log tin nhắn:', error)
            }
        }
    });

    client.on('messageCreate', async (message) => {
        if (message.reference?.messageId) {
            const trackedUser = Array.from(trackedUsers.values()).find(user => user.lastMessageId === message.reference.messageId);
    
            if (trackedUser) {
                try {
                    // Fetch kênh mà người bị track đang hoạt động
                    const userActiveChannel = await client.channels.fetch(trackedUser.lastChannelId);
    
                    // Fetch tin nhắn gốc để lấy nội dung và username
                    const originalMessage = await userActiveChannel.messages.fetch(trackedUser.lastOriginalMessageId);
    
                    // Giả lập reply bằng cách chèn thông tin tin nhắn gốc
                    let replyMessage = `***${message.author.username}*** *reply từ server* ***${message.guild.name}*** *tới* ***"${originalMessage.author.toString()}: ${originalMessage.content || "[No content]"}*** " với nội dung\n\n${message.content}`;
                    replyMessage += sendAttachment(message)
                    await userActiveChannel.send(replyMessage);
                } catch (error) {
                    console.error('Lỗi khi gửi reply:', error);
                }
            }
        }
    });       
}