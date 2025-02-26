const { EmbedBuilder } = require("discord.js")
const translatte = require("translatte")

async function translateChat(message, sourceMessageId, languageSuppose){
    try{
    const sourceMessage = await message.channel.messages.fetch(sourceMessageId)
    const originalText = sourceMessage.content
    const result = await translatte(originalText, {to : languageSuppose})

    // Tạo embed
    const embed = new EmbedBuilder()
        .setTitle("TRANSLATE RESULT:")
        .addFields(
                    {name: 'BEFORE', value: originalText},
                    {name: 'AFTER', value: result.text }
        )
        .setColor('Random')

        await message.reply({ embeds: [embed] })
    } catch (error){
        console.error(error)
        await message.reply("Ngôn ngữ không hỗ trợ hoặc bạn đã nhập sai")
    }
}

module.exports = { translateChat }