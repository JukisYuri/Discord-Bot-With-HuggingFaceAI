require('dotenv').config()
const { Client, GatewayIntentBits, ActivityType } = require('discord.js')

//------------Commands------------
const { restart } = require('./src/command/restart.js')
const { steal } = require('./src/command/steal.js')
const { translate } = require('./src/command/translate.js')
const { track, server_track } = require('./src/command/track.js');
const { untrack } = require('./src/command/untrack.js');
const { resetListTracking } = require('./src/command/reset_list.js');
const { moveallListTracking } = require('./src/command/moveall_list.js');
const { listTracking, visualListTracking } = require('./src/command/listtracking.js');
const { help, cachdung, thongtinAuthor, thongtinBot } = require('./src/command/help.js')
const { fetchLog } = require('./src/command/fetch.js')
const { checkRole } = require('./src/command/checkrole.js')
const { checkUser } = require('./src/command/checkuser.js')
const { tracking_translate } = require('./src/command/tracking_translate.js')
//----------Utilities--------------
const tracker = require('./src/utilities/tracker.js');
//----------Helpers----------------
const { setupAutoSave } = require('./src/helper/savedata.js')
//----------Data-------------------
const { dataLoad } = require('./src/data/loadData.js')
//----------Others-----------------
const { prompt } = require('./src/AI_prompt.js')
const path = './src/data/trackedUsers.json';  // file lưu dữ liệu

//---------------------------------------------------------------

const client = new Client({
    intents: [GatewayIntentBits.Guilds, 
            GatewayIntentBits.GuildMessages, 
            GatewayIntentBits.MessageContent, 
            GatewayIntentBits.GuildMembers, 
            GatewayIntentBits.DirectMessages],
})

const trackedUsers = new Map() // Khai báo quan trọng nhất của track
// Load dữ liệu
dataLoad(trackedUsers)

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setActivity('khởi đầu với !help hoặc !cách dùng', { type: ActivityType.Watching }),
    client.user.setPresence({ status: 'idle' })
    setupAutoSave(trackedUsers, path); // Mỗi lần ready, sẽ nạp vào từ folder data
})

//---------------------------------------------------------------

tracker(client, trackedUsers)

//-------------------------------------------------------------

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    restart(message, trackedUsers, path) // 

    help(message) // 
    cachdung(message) //
    thongtinAuthor(message) //
    thongtinBot(message) // 

    steal(message, client) // 
    fetchLog(message, client) //
    
    tracking_translate(message, client)
    translate(message) // 

    track(message, trackedUsers, path) // 
    server_track(message, trackedUsers, client, path) //

    listTracking(message, trackedUsers) //
    visualListTracking(message, trackedUsers, client) //
    moveallListTracking(message, trackedUsers, path) //
    untrack(message, trackedUsers, path) //
    resetListTracking(message, trackedUsers, path) //

    checkRole(message) //
    checkUser(message) //

    try {
        if(message.content.startsWith("! ")){
            return prompt(message)
    } else {
        return;
    }
} catch (error) {
    console.error(error.message)
    await message.reply("⚠️ Đã có vấn đề trong đoạn mã bạn đang viết")
}
})

client.login(process.env.BOT_TOKEN)