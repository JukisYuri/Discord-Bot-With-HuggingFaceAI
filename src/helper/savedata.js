const fs = require('fs');

// Hàm lưu dữ liệu vào file JSON
function saveData(trackedUsers, path) {
    const dataToSave = Array.from(trackedUsers.entries());
    fs.writeFileSync(path, JSON.stringify(dataToSave, null, 2), 'utf8');
    console.log('✅ Saved trackedUsers.json');
}

function setupAutoSave(trackedUsers, path, interval = 3600000) { // Mặc định 1 tiếng
    setInterval(() => saveData(trackedUsers, path), interval);

    // Lưu dữ liệu khi dừng bot (Ctrl + C)
    process.on('SIGINT', () => {
        saveData(trackedUsers, path);
        process.exit();
    });
}

module.exports = { saveData, setupAutoSave }
