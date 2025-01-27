const { splitMessage } = require('../helper/split_message');
const { preventMention, preventMentionRole } = require('../helper/prevent_mentions_users');
const { sendAttachment } = require('../helper/attachment');

async function fetchLogDataChannelWithTarget(client, message, targetId, sourceChannelId, destinateChannelId) {
    try {
        const sourceChannel = await client.channels.fetch(sourceChannelId);
        const destinateChannel = await client.channels.fetch(destinateChannelId);
        const target = await client.users.fetch(targetId); // Đây là lấy của người dùng

        let combinedMessage = '';
        let lastMessageId = null;
        let messagesFetched = 0;

        // Lặp lại quá trình fetch cho đến khi đạt tối đa 100 tin nhắn của người dùng mục tiêu
        while (messagesFetched < 100) {
            const fetchRequest = await sourceChannel.messages.fetch({ 
                limit: 100, // Số tin nhắn tối đa mỗi lần fetch
                before: lastMessageId // Lấy tin nhắn cũ hơn, nếu có
            });

            if (fetchRequest.size === 0) break; 

            fetchRequest.forEach((msg) => {
                // Chỉ lấy tin nhắn của người dùng mục tiêu
                if (msg.author.id === target.id) {
                    preventMention(msg)
                    preventMentionRole(msg)
                    const attachment = sendAttachment(msg)
                    combinedMessage += `[${msg.createdAt.toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}] ${msg.author.username}: ${msg.content} ${attachment}\n`;
                    messagesFetched++;
                }
            });

            // Cập nhật id của tin nhắn cuối cùng để tiếp tục fetch các tin nhắn trước đó
            lastMessageId = fetchRequest.last().id;

            if (messagesFetched >= 100) break; // Nếu đã lấy đủ 100 tin nhắn
        }

        // Kiểm tra nếu có tin nhắn và gửi chúng
        if (combinedMessage.length > 0) {
            const chunkMessage = splitMessage(combinedMessage);
            for (const chunk of chunkMessage) {
                await destinateChannel.send(chunk);
            }
        } else {
            await message.reply('Không có tin nhắn nào của người dùng mục tiêu trong kênh nguồn.');
        }

    } catch (error) {
        console.log(error);
        await message.reply('Đã xảy ra lỗi khi fetch tin nhắn.');
    }
}

module.exports = { fetchLogDataChannelWithTarget };
