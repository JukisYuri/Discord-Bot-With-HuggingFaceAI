function preventMention(msg){
    if (msg.mentions.users.size > 0) { 
        msg.mentions.users.forEach((user) => {
            const mentionTag = `<@${user.id}>`; 
            msg.content = msg.content.replace(new RegExp(mentionTag, 'g'), user.username);
        });
    }
}

module.exports = { preventMention }