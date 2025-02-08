const { tutorialForUsingBot, tutorialUse, informationAuthor, informationBot } = require('../tutorial.js')

async function help(message){
    if (message.content.startsWith("!help")){
        await message.channel.sendTyping()
        return tutorialForUsingBot(message) // vì bên kia reply nên truyền đối tượng message, ko phải message.content
    } 
}

async function cachdung(message){
    if (message.content.startsWith("!cách dùng")){
        await message.channel.sendTyping()
        return tutorialUse(message)
    }
}

async function thongtinAuthor(message) {
    if (message.content.startsWith("!thông tin chủ bot")){
        await message.channel.sendTyping()
        return informationAuthor(message)
    }
}

async function thongtinBot(message) {
    if (message.content.startsWith("!thông tin về con bot")){
        await message.channel.sendTyping()
        return informationBot(message)
    }
}

module.exports = { help, cachdung, thongtinAuthor, thongtinBot }