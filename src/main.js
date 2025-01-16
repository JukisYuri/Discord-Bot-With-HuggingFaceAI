require('dotenv').config()
const { Client, GatewayIntentBits, ActivityType } = require('discord.js')
const { tutorialForUsingBot, tutorialUse, informationAuthor, informationBot } = require('./tutorial.js')
const { prompt } = require('./AI_prompt.js')
const { fetchLogDataChannel } = require('./utilities/fetchdata.js')

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setActivity('đoạn mã thiểu năng đang được viết', { type: ActivityType.Watching });
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    
    if (message.content.includes("! help")){
        await message.channel.sendTyping()
        return tutorialForUsingBot(message) // vì bên kia reply nên truyền đối tượng message, ko phải message.content
    }
    if (message.content.includes("! cách dùng")){
        await message.channel.sendTyping()
        return tutorialUse(message)
    }
    if (message.content.includes("! thông tin chủ bot")){
        await message.channel.sendTyping()
        return informationAuthor(message)
    }
    if (message.content.includes("! thông tin về con bot")){
        await message.channel.sendTyping()
        return informationBot(message)
    }
    if (message.content.includes("! fetch")){
        const command = message.content.trim()
        const sourchannelId = command.substring(8,27).trim()
        const destinateChannelId = command.substring(31,50).trim()
        await message.channel.sendTyping()
        return fetchLogDataChannel(client, message, sourchannelId, destinateChannelId)
    }

    try {
        if(message.content.startsWith("! ")){
            return prompt(message)
    } else {
        return;
    }
} catch (error) {
    console.log(error.message)
    await message.reply("Đã có vấn đề trong đoạn mã bạn đang viết")
}
})

client.login(process.env.BOT_TOKEN)