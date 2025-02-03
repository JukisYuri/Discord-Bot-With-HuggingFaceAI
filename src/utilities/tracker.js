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
                    logMessage += `_**${message.author.username}** replying to **${referenceMessage.author.username}: ${referenceMessage.content || ""}**_\n`
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
                await destinateChannel.send(logMessage)

            } catch (error) {
                console.error('Lỗi khi gửi log tin nhắn:', error)
            }
        }
    });
};

