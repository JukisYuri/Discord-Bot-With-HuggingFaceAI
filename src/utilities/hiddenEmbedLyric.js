async function hiddenEmbedLyric(message) {
    try {
    let lyricTextOfHazyMoonLight = [
        `微睡むように`,
        `辿る千年前の記憶`,
        `色褪せたように`,
        `映る私の瞳`,
        `孤独の正体はただ`,
        `幾度も重ねる追憶`,
        `朧気ながらも`,
        `君想い涙を流す`,
        `遠い遠いあの場所`,
        `何もできない焦燥`,
        `私の総て`,
        `まだ見ぬ愛し君に捧げて`,
        `憶えているのはただ`,
        `月と群青色の涙`,
        `そこに居るのと`,
        `君の影 思いを馳せる`,
        `会えなくて`,
        `この世に蘇ると信じていたのは`,
        `独りよがりの夢か？`,
        `遠くなる意識`,
        `儚く貪欲な生命`,
        `奪い去られた記憶ごと総て`,
        `空に掲げて`,
        `それでも確かにただ`,
        `辿る千年前の記憶`,
        `色褪せる今日も`,
        `君想い涙を流す愛してた`,
    ]
    let sentMessage = await message.channel.send("**Secret Start**")
    let welcomeText = ["3","2","1"]
    for (const text of welcomeText){
        await sentMessage.edit(`\`${text}\``);
        await new Promise(r => setTimeout(r, 1000)); // Đợi 1 giây
    }

        // Hiển thị lyric 
        for (const lyric of lyricTextOfHazyMoonLight) {
            let display = "";
            for (let i = 0; i < lyric.length; i++) {
                display = `${lyric.slice(0, i)}\`${lyric[i]}\`${lyric.slice(i + 1)}`
                await sentMessage.edit(display);
                await new Promise(r => setTimeout(r, 500)); // Hiệu ứng chạy từng chữ
            }
            await new Promise(r => setTimeout(r, 1000)); 
        }
    } catch (error){
        console.error(error)
        await message.reply("Đã phát sinh lỗi không mong muốn")
    }
}

module.exports = { hiddenEmbedLyric }