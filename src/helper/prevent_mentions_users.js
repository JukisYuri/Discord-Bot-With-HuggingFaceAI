function preventMention(msg){
    if (msg.mentions.users.size > 0) { 
        msg.mentions.users.forEach((user) => {
            const mentionTag = `<@${user.id}>`; 
            msg.content = msg.content.replace(new RegExp(mentionTag, 'g'), user.username);
        });
    }
}

function preventMentionRole(msg){
    if (msg.mentions.roles.size > 0) { 
        msg.mentions.roles.forEach((role) => {
            const mentionTag = `<@&${role.id}>`; 
            msg.content = msg.content.replace(new RegExp(mentionTag, 'g'), role.name);
        });
    }
}

module.exports = { preventMention, preventMentionRole }