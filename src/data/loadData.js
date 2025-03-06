const fs = require('fs')
const path = './src/data/trackedUsers.json';  // file lưu dữ liệu

function dataLoad(trackedUsers){
// Load dữ liệu, nếu trống thì bỏ qua
if (fs.existsSync(path)) {
    const rawData = fs.readFileSync(path, 'utf8');

    // Nếu file trống thì bỏ qua không parse
    if (rawData.trim().length > 0) {
        try {
            const savedData = JSON.parse(rawData);
            trackedUsers.clear()
            savedData.forEach(([userId, info]) => {
                trackedUsers.set(userId, info);
            });
            console.log('✅ Dữ liệu đã được nạp lại từ file trackedUsers.json');
        } catch (err) {
            console.error('❌ Lỗi khi phân tích file trackedUsers.json:', err.message);
        }
    } else {
        console.log('⚠️ File trackedUsers.json trống, chưa có dữ liệu để nạp.');
    }
} else {
    console.log('📂 Chưa có file trackedUsers.json. Dữ liệu sẽ được tạo khi bạn dùng !track.');
}
}

module.exports = { dataLoad }