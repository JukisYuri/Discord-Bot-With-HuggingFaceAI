function tutorialForUsingBot(message){
        message.reply('**Cách để sử dụng em cho đúng:**' + '\n' + '- Lệnh **! cách dùng** sẽ cho biết cách dùng'
                                                    + '\n' + '- Lệnh **! thông tin chủ bot** sẽ cho biết thông tin về chủ bot'
                                                    + '\n' + '- Lệnh **! thông tin về con bot** sẽ dẫn đến link github chứa mã nguồn của con bot'
    )
}

function tutorialUse(message){
    message.reply('Để dùng em, hãy sử dụng cú pháp sau:' + '\n' + '**! {câu hỏi}**' + '\n' + 'VD: ! Java là gì?\n\n' +
                '**Với các tiện ích:**\n' + 'Reply đoạn tin nhắn và nhập lệnh **! translate {ngôn ngữ}**\n' + 'VD: ! translate vi\n' +
                '**! fetch {ID kênh nguồn} to {ID kênh đích}**\n' + 
                'Dùng để lấy log 100 tin nhắn gần nhất trên kênh nguồn được chỉ định\n' +
                '**! steal {ID người dùng} from {ID kênh nguồn} to {ID kênh đích}**\n' +
                'Dùng để lấy log 100 tin nhắn gần nhất trên kênh nguồn và người dùng được chỉ định\n' +
                '**! track {ID người dùng} from {ID máy chủ} to {ID kênh đích}**\n' +
                'Dùng để theo dõi người dùng trên một máy chủ chỉ định\n'
    )
}

function informationAuthor(message){
    message.reply(  "**Đây là toàn bộ thông tin về ngài ạ:**\n" +
                    "- **Carrd**: [jukisyuri.carrd.co](https://jukisyuri.carrd.co/)\n" +
                    "- **Github**: [JukisYuri](https://github.com/JukisYuri)\n" +
                    "- **Facebook**: [yourlifehehe](https://www.facebook.com/yourlifehehe/)\n")
}

function informationBot(message){
    message.reply('Bot này đang sử dụng ngôn ngữ JavaScript, sử dụng DiscordJS phiên bản mới nhất\n' +
                    '**Source Code:** https://github.com/JukisYuri/Discord-Bot-With-HuggingFaceAI\n\n' +
                    '__**Hãy tôn trọng bản quyền của người làm ra bot, và tôn trọng bản quyền của người làm ra model**__\n' +
                    '**Author Discord Bot: JukisYuri**\n' +
                    '**Author AI-Model: Qwen**'
    )
}

module.exports = { tutorialForUsingBot, tutorialUse, informationAuthor, informationBot }