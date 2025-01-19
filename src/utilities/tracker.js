module.exports = (client, trackedUsers) => {
    client.on('messageCreate', async (message) => {
        // Kiểm tra nếu user đang bị theo dõi
        const trackedInfo = trackedUsers.get(message.author.id);

        if (
            trackedInfo &&
            message.guild.id === trackedInfo.serverId &&
            !message.author.bot // Bỏ qua tin nhắn từ bot
        ) {
            try {
                const destinateChannel = await client.channels.fetch(trackedInfo.destinateChannelId);

                const logMessage = `[${message.createdAt.toLocaleString()} ,${message.channel.name}] ${message.author.username}: ${message.content}\n`;

                await destinateChannel.send(logMessage)
                console.log(`Đã gửi log tin nhắn từ ${message.author.id} tới kênh ${trackedInfo.destinateChannelId}`);
            } catch (error) {
                console.error('Lỗi khi gửi log tin nhắn:', error);
            }
        }
    });
};

