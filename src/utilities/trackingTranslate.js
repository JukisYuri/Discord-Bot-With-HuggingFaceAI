const { EmbedBuilder } = require("discord.js")
const translatte = require("translatte")

async function trackingTranslate(message, client, destinateChannelId) {
    try {
    if (!message.content || message.author.bot) return
    if (destinateChannelId !== message.channel.id) return
    await message.channel.sendTyping()
    
    const destinateChannel = await client.channels.fetch(destinateChannelId)
    const originalText = message.content
    const [resultJa, resultEn, resultVi] = await Promise.all([
        translatte(originalText, { to: "ja" }),
        translatte(originalText, { to: "en" }),
        translatte(originalText, { to: "vi"})
    ]);

    let embed = new EmbedBuilder()
    .setTitle("TRANSLATE RESULT (TRACKING)")
    .setColor('Green')
    if (originalText.toLowerCase().trim() === resultEn.text.toLowerCase().trim()){
        embed.addFields({name: "JAPANESE", value: resultJa.text},
                        {name: "VIETNAMESE", value: resultVi.text}
    )
    } else if (originalText.toLowerCase().trim() === resultJa.text.toLowerCase().trim()){
        embed.addFields({name: "ENGLISH", value: resultEn.text},
                        {name: "VIETNAMESE", value: resultVi.text}
    ) 
    } else if (originalText.toLowerCase().trim() === resultVi.text.toLowerCase().trim()){
        embed.addFields({name: "ENGLISH", value: resultEn.text},
                        {name: "JAPANESE", value: resultJa.text}
    ) 
    } else {
        embed.addFields({name: "ENGLISH", value: resultEn.text},
            {name: "JAPANESE", value: resultJa.text},
            {name: "VIETNAMESE", value: resultVi.text}
    ) 
    }

    await destinateChannel.send({ embeds: [embed] })
    } catch (error) {
        console.error(error)
        await message.reply("⚠️ Đã có lỗi phát sinh không mong muốn")
    }
}

module.exports = { trackingTranslate }