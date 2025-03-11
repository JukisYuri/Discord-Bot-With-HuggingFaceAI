const { EmbedBuilder } = require("discord.js");
const { sendAttachment } = require("../helper/attachment");
const { preventMention, preventMentionRole, preventMentionEveryone } = require("../helper/prevent_mentions_users");

let ghostMode = false
let newUI = false
module.exports = (client, trackedUsers) => {
    client.on('messageCreate', async (message) => {
        if (message.content.trim() === "!shortened"){
            ghostMode = !ghostMode
            return message.reply(`Shorten Mode đã được ${ghostMode ? "bật" : "tắt"}. Các log sau đây sẽ ${ghostMode ? "được rút gọn" : "đầy đủ"}.`)
        }

        if (message.content.trim() === "!newUI"){
            newUI = !newUI
            return message.reply(`Tính năng NewUI đã được ${newUI ? "bật" : "tắt"}. Giao diện sẽ được thay đổi sang phiên bản ${newUI ? "mới" : "cũ"}.`)
        }

        const randomText = ["You have no idea what's coming next.", 
                            "Some doors, once opened, can never be closed.",
                            "Tick-tock... time is running out.",
                            "You’re not ready for what’s next.",
                            "Be careful what you wish for.",
                            "Access granted… but at what cost?",
                            "The system is watching.",
                            "You're already in too deep.",
                            "Nothing stays hidden forever.",
                            "Decryption in progress… are you sure?",
                            "Some secrets should remain buried.",
                            "Something is watching you.",
                            "It knows you're here."
        ]

        const randomMessage = randomText[Math.floor(Math.random() * randomText.length)];

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
                let embed = new EmbedBuilder().setColor("Purple")
                let logMessage = ""

                // Why am I here?
                if (message.reference?.messageId){
                    const referenceMessage = await message.channel.messages.fetch(message.reference.messageId)
                    if (newUI){
                    embed.addFields({
                        name: "꩜ Reply",
                        value: `**${message.author.username}** phản hồi **${referenceMessage.author.username}: ${referenceMessage.content || "[No Content]"}**`,
                    })
                } else {
                    const referenceMessage = await message.channel.messages.fetch(message.reference.messageId)
                    logMessage += `***${message.author.username}*** *replying to* ***${referenceMessage.author.username}: ${referenceMessage.content || "[No Content]"}***\n`
                }
            }

                if (newUI){
                embed.setTitle("📌 TRACKING USERS").setTimestamp().setFooter({text: randomMessage, iconURL: client.user.displayAvatarURL()})
                if (ghostMode) {
                    embed.addFields(
                        { name: "❋ Chat", 
                            value: `**${message.author.username}**: ${message.content}`, inline: true},
                    )
                } else {
                    embed.setDescription(`**Server:** ${message.guild.name}\n**Kênh:** <#${message.channel.id}>`)
                    .addFields(
                        { name: "❋ Chat", 
                            value: `**${message.author.username}**: ${message.content}`, inline: true},
                    )
                }
            } else {
                if (ghostMode){
                    logMessage +=
                            trackedInfo.serverId === "global"
                                    ? `🌐 **${message.author.username}**: ${message.content}\n`
                                    : `**${message.author.username}**: ${message.content}\n`
                    logMessage += sendAttachment(message)
                } else {
                    const defaultVNTime = `${message.createdAt.toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })}`;
                        logMessage +=
                            trackedInfo.serverId === "global"
                                ? `(*) [\`${defaultVNTime}\`] **${message.guild.name} - ${message.channel.name}**\n` +
                                `${message.author.username}: ${message.content}\n\n`
                                : `[\`${defaultVNTime}\`] **${message.guild.name} - ${message.channel.name}**\n` +
                                `${message.author.username}: ${message.content}\n\n`;
                        
                                // ? `🌐 [${message.createdAt.toLocaleString("vi-VN", {timeZone: "Asia/Ho_Chi_Minh",})} | ${message.guild.name} | ${message.channel.name}] **${message.author.username}**: ${message.content}\n`
                                // : `[${message.createdAt.toLocaleString("vi-VN", {timeZone: "Asia/Ho_Chi_Minh",})} | ${message.guild.name} | ${message.channel.name}] **${message.author.username}**: ${message.content}\n`
                    logMessage += sendAttachment(message)
                }
            }
            let sentMessage = ""
                if (newUI){
                    await destinateChannel.send({ embeds: [embed], files: sendAttachment(message) || [] });
                } else {
                    sentMessage = await destinateChannel.send(logMessage)
                }

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
                    let originalReply = `↪ ${originalMessage.author.toString()}: ${originalMessage.content || ""}`
                    let replyMessage = `${originalReply}\n \`${message.guild.name}\` **${message.author.username}**: ${message.content}`
                    replyMessage += sendAttachment(message);
                    await userActiveChannel.send(replyMessage);
                } catch (error) {
                    console.error("Lỗi khi gửi reply:", error);
                }
            }
        }
    });
};