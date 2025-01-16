function splitMessage(content, maxLength = 2000) {
    const chunks = [];
    while (content.length > 0) {
        let chunk = content.slice(0, maxLength);

        // Tìm vị trí hợp lý để ngắt dòng, tránh ngắt giữa số thứ tự hoặc giữa các mục quan trọng
        if (content.length > maxLength) {
            const lastBreak = Math.max(
                chunk.lastIndexOf('\n'),
                chunk.lastIndexOf(' '), 
                chunk.lastIndexOf('.'), 
                chunk.lastIndexOf(','), 
                chunk.lastIndexOf('!'), 
                chunk.lastIndexOf('?')  
            );

            // Nếu không tìm được vị trí ngắt, dùng độ dài tối đa
            if (lastBreak > -1) {
                chunk = content.slice(0, lastBreak + 1);
            }
        }

        // Đảm bảo không để số thứ tự hoặc ký tự bị tách rời
        if (/^\d+\.$/.test(content.slice(chunk.length).trim())) {
            const extraPart = content.slice(chunk.length, chunk.length + 10); // Kiểm tra đoạn tiếp theo
            const match = extraPart.match(/^\d+\./); // Số thứ tự
            if (match) {
                chunk += match[0];
            }
        }

        chunks.push(chunk.trim());
        content = content.slice(chunk.length).trim();
    }
    return chunks;
}

module.exports = { splitMessage }