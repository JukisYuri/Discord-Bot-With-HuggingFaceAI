const { splitMessage } = require('../helper/split_message')
const { preventMention, preventMentionRole } = require('../helper/prevent_mentions_users')
const { sendAttachment } = require('../helper/attachment')

async function fetchLogDataChannel(client, message, sourceChannelId, destinateChannelId){
    try{
        const sourceChannel = await client.channels.fetch(sourceChannelId)
        const destinateChannel = await client.channels.fetch(destinateChannelId)

        const fetchRequest = await sourceChannel.messages.fetch({ limit: 100 })

        let combinedMessage = ''
        fetchRequest.forEach((msg) => {
            preventMention(msg)
            preventMentionRole(msg)
            const attachment = sendAttachment(msg)
            combinedMessage += `[${msg.createdAt.toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}] ${msg.author.username}: ${msg.content} ${attachment}\n`
        })
    
        if (combinedMessage.length > 0) {
            const chunkMessage = splitMessage(combinedMessage)
            for (const chunk of chunkMessage){
                await destinateChannel.send(chunk)
            }
        } else {
            await message.reply('Không có tin nhắn nào trong kênh nguồn.');
        }
    }
    catch(error){
        console.log(error.message)
    }
}

module.exports = { fetchLogDataChannel }