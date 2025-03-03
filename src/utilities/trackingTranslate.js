const { EmbedBuilder } = require("discord.js")
const translatte = require("translatte")

async function trackingTranslate(message, client, destinateChannelId) {
    try {
    const destinateChannel = await client.channels.fetch(destinateChannelId)
    const originalText = message.content
    const [resultJa, resultEn] = await Promise.all([
        translatte(originalText, { to: "ja" }),
        translatte(originalText, { to: "en" })
    ]);

    const embed = new EmbedBuilder()
    .setTitle("TRANSLATE RESULT (TRACKING)")
    .addFields({name: "JAPANESE", value: resultJa.text},
             {name: "ENGLISH", value: resultEn.text}
    )
    .setColor('Green')

    await destinateChannel.send({ embeds: [embed] })
    } catch (error) {
        console.error(error)
        await message.reply("⚠️ Đã có lỗi phát sinh không mong muốn")
    }
}

module.exports = { trackingTranslate }