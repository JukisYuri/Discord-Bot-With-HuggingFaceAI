const { EmbedBuilder } = require("discord.js")

async function embedSecretMessage(message, client, userId) {
    try {
        if (message.author.bot) return
        const user = await client.channels.fetch(userId)
        let embed = new EmbedBuilder()
        .setTitle("SEND PRIVATE MESSAGE")
        .setColor('Random')
        .setAuthor({name: "JukisYuri", iconURL: "https://i.pinimg.com/736x/a6/5b/f8/a65bf8df63a78de7caa492c077504331.jpg"})
        .setFooter({text: "You have no idea what's coming next."})
        await user.send()
    } catch (error){
        console.error(error)
        await message.reply("⚠️ Đã xảy ra lỗi khi bạn nhập, vui lòng nhập lại")
    }
}

module.exports =  { embedSecretMessage }