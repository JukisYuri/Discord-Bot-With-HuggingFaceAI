require('dotenv').config()
const { Client, GatewayIntentBits, ActivityType } = require('discord.js')
const { tutorialForUsingBot, tutorialUse, informationAuthor, informationBot } = require('./src/tutorial.js')
const { prompt } = require('./src/AI_prompt.js')
const { fetchLogDataChannel } = require('./src/utilities/fetchdata.js')
const { fetchLogDataChannelWithTarget } = require('./src/utilities/fetchdata_target.js')

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

    if (message.content.includes("! steal from")) { 
        // ! steal from 607183227911667746 with 1132656734251520023 to 1313376059030507590
        const commandTarget = message.content.trim();
        const parts = commandTarget.split(' ');
    
        const targetId = parts[3]; 
        const sourceChannelId = parts[5]; 
        const destinateChannelId = parts[7]; 
        console.log(`Target ID: ${targetId}`);
        console.log(`Source Channel ID: ${sourceChannelId}`);
        console.log(`Destinate Channel ID: ${destinateChannelId}`);
    
        await message.channel.sendTyping();
        return fetchLogDataChannelWithTarget(client, message, targetId, sourceChannelId, destinateChannelId);
    }

    if (message.content.includes("! fetch")){
        const command = message.content.trim()
        const parts = command.split(' ')

        const sourceChannelId = parts[2]
        const destinateChannelId = parts[4]
        console.log(`Source Channel ID: ${sourceChannelId}`);
        console.log(`Destinate Channel ID: ${destinateChannelId}`);

        await message.channel.sendTyping()
        return fetchLogDataChannel(client, message, sourceChannelId, destinateChannelId)
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