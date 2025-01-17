const translatte = require("translatte")

async function translateChat(message, sourceMessageId, languageSuppose){
    try{
    const sourceMessage = await message.channel.messages.fetch(sourceMessageId)
    const result = await translatte(sourceMessage.content, {to : languageSuppose})

    await message.reply(result.text)
    } catch (error){
        console.log(error)
        await message.reply("Ngôn ngữ không hỗ trợ hoặc bạn nhập sai")
    }
}

module.exports = { translateChat }