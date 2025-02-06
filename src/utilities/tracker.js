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
                                    ? `🌐 **${message.author.username}**: ${message.content}\n`
                                    : `**${message.author.username}**: ${message.content}\n`
                    logMessage += sendAttachment(message)
                } else {
                        logMessage +=
                            trackedInfo.serverId === "global"
                                    ? `🌐 [${message.createdAt.toLocaleString("vi-VN", {
                                          timeZone: "Asia/Ho_Chi_Minh",
                                      })} | ${message.guild.name} | ${message.channel.name}] **${message.author.username}**: ${message.content}\n`
                                    : `[${message.createdAt.toLocaleString("vi-VN", {
                                          timeZone: "Asia/Ho_Chi_Minh",
                                      })} | ${message.guild.name} | ${message.channel.name}] **${message.author.username}**: ${message.content}\n`
                    logMessage += sendAttachment(message)
                }
                const sentMessage = await destinateChannel.send(logMessage)

                if (!trackedInfo.messages){
                    trackedInfo.messages = []
                }

                // Lưu lại tin nhắn vào danh sách
                trackedInfo.messages.push({
                    originalMessageId: message.id, // ID tin nhắn gốc của user bị track
                    trackedMessageId: sentMessage.id, // ID tin nhắn bot đã log
                    guildId: message.guild.id,
                    channelId: message.channel.id,
                    username: message.author.username,
                    content: message.content,
                });

            } catch (error) {
                console.error('Lỗi khi gửi log tin nhắn:', error)
            }
        }
    });

    client.on("messageCreate", async (message) => {
        if (message.reference?.messageId) {
            // Tìm người dùng có tin nhắn bị reply trong danh sách trackedUsers
            const trackedUser = Array.from(trackedUsers.values()).find(user =>
                user.messages && user.messages.some(msg => msg.trackedMessageId === message.reference.messageId)
            );

            if (trackedUser) {
                try {
                    // Tìm tin nhắn gốc trong danh sách
                    const originalMessageInfo = trackedUser.messages.find(msg => msg.trackedMessageId === message.reference.messageId);
                    if (!originalMessageInfo) return;

                    // Fetch kênh mà người bị track đã gửi tin nhắn
                    const userActiveChannel = await client.channels.fetch(originalMessageInfo.channelId);

                    // Fetch tin nhắn gốc để lấy nội dung và username
                    const originalMessage = await userActiveChannel.messages.fetch(originalMessageInfo.originalMessageId);

                    // Giả lập reply bằng cách chèn thông tin tin nhắn gốc
                    let replyMessage = `***${message.author.username}*** *reply từ server* ***${message.guild.name}*** *tới* ***"${originalMessage.author.toString()}: ${originalMessage.content || "[No content]"}*** " với nội dung\n\n${message.content}`;
                    replyMessage += sendAttachment(message);
                    await userActiveChannel.send(replyMessage);
                } catch (error) {
                    console.error("Lỗi khi gửi reply:", error);
                }
            }
        }
    });
};