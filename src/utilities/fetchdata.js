const { splitMessage } = require('../split_message')
const { preventMention } = require('../prevent_mentions_users')

async function fetchLogDataChannel(client, message, sourceChannelId, destinateChannelId){
    try{
        const sourceChannel = await client.channels.fetch(sourceChannelId)
        const destinateChannel = await client.channels.fetch(destinateChannelId)

        const fetchRequest = await sourceChannel.messages.fetch({ limit: 100 })

        let combinedMessage = ''
        fetchRequest.forEach((msg) => {
            preventMention(msg)
            combinedMessage += `[${msg.createdAt.toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}] ${msg.author.username}: ${msg.content}\n`
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