function sendAttachment(msg) {
    if (!msg || !msg.attachments || msg.attachments.size === 0){
        return ''
    }
    let attachmentLinks = ''
        msg.attachments.forEach((attachment) => {
        attachmentLinks += `${attachment.url}\n`
        })
    return attachmentLinks; // Trả về các đường dẫn file đính kèm
}

module.exports = { sendAttachment };
