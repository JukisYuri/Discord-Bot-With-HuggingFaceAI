function tutorialForUsingBot(message){
        message.reply('**Cách để sử dụng em cho đúng:**' + '\n' + '- Lệnh **! cách dùng** sẽ cho biết cách dùng'
                                                    + '\n' + '- Lệnh **! thông tin chủ bot** sẽ cho biết thông tin về chủ bot'
                                                    + '\n' + '- Lệnh **! thông tin về con bot** sẽ dẫn đến link github chứa mã nguồn của con bot'
    )
}

function tutorialUse(message){
    message.reply('Để dùng em, hãy sử dụng cú pháp sau:' + '\n' + '**! {câu hỏi}**' + '\n' + 'VD: ! Java là gì?')
}

function informationAuthor(message){
    message.reply(  "**Đây là toàn bộ thông tin về ngài ạ:**\n" +
                    "- **Carrd**: [jukisyuri.carrd.co](https://jukisyuri.carrd.co/)\n" +
                    "- **Github**: [JukisYuri](https://github.com/JukisYuri)\n" +
                    "- **Facebook**: [yourlifehehe](https://www.facebook.com/yourlifehehe/)\n")
}

function informationBot(message){
    message.reply('Bot này đang sử dụng ngôn ngữ JavaScript, sử dụng DiscordJS phiên bản mới nhất')
}

module.exports = { tutorialForUsingBot, tutorialUse, informationAuthor, informationBot }