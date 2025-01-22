const { preventMention, preventMentionRole } = require("../helper/prevent_mentions_users");

module.exports = (client, trackedUsers) => {
    client.on('messageCreate', async (message) => {
        // Kiểm tra nếu user đang bị theo dõi
        const trackedInfo = trackedUsers.get(message.author.id);

        if (
            trackedInfo &&
            (trackedInfo.serverId === "global" || message.guild.id === trackedInfo.serverId) &&
            !message.author.bot 
        ) {
            try {
                const destinateChannel = await client.channels.fetch(trackedInfo.destinateChannelId);
                preventMention(message)
                preventMentionRole(message)
                // logMessage tùy thuộc vào serverId
                        const logMessage =
                            trackedInfo.serverId === "global"
                                    ? `[${message.createdAt.toLocaleString("vi-VN", {
                                          timeZone: "Asia/Ho_Chi_Minh",
                                      })} | ${message.guild.name} | ${message.channel.name}] ${message.author.username}: ${message.content}\n`
                                    : `[${message.createdAt.toLocaleString("vi-VN", {
                                          timeZone: "Asia/Ho_Chi_Minh",
                                      })} | ${message.channel.name}] ${message.author.username}: ${message.content}\n`;
                    await destinateChannel.send(logMessage)

            } catch (error) {
                console.error('Lỗi khi gửi log tin nhắn:', error);
            }
        }
    });
};

