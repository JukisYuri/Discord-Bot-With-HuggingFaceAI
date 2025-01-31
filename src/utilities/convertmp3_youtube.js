const path = require('path');
const fs = require('fs');
const YTDlpWrap = require('yt-dlp-wrap').default;

// Xây dựng đường dẫn tương đối đến yt-dlp.exe
const ytDlpPath = path.join(__dirname, '../../extension/yt-dlp.exe'); // Window
// const ytDlpPath = path.join(__dirname, '../../extension/yt-dlp_linux'); // Linux

// Xây dựng đường dẫn tương đối đến ffmpeg
const ffmpegPath = path.join(__dirname, '../../ffmpeg-2025-01-30-git-1911a6ec26-essentials_build/bin/ffmpeg.exe');

// Khởi tạo yt-dlp-wrap với đường dẫn tới yt-dlp.exe
const ytDlpWrap = new YTDlpWrap(ytDlpPath);

// Sử dụng ytDlpWrap trong hàm
async function convertMP3(sourceLink, message) {
        await message.reply("⏳ Đang tải và chuyển đổi video sang dạng audio...");

        const outputFileName = `audio_${Date.now()}.mp3`;
        const outputPath = path.join(__dirname, outputFileName);

        // Tiến hành tải video và chuyển đổi sang MP3
        const ytDlpEventEmitter = ytDlpWrap.exec([
            sourceLink,
            '-f', 'bestaudio',
            '-x', '--audio-format', 'mp3',
            '--ffmpeg-location', ffmpegPath,
            '-o', outputPath,
        ]);

        // Theo dõi tiến trình tải và chuyển đổi
        ytDlpEventEmitter.on('progress', (progress) => {
            console.log(`Progress: ${progress.percent}%`);
        });

        // Xử lý lỗi
        ytDlpEventEmitter.on('error', (error) => {
            console.error(error);
            message.reply("❌ Đã xảy ra lỗi khi tải video. Vui lòng thử lại.");
        });

        // Xử lý khi lệnh hoàn thành
        ytDlpEventEmitter.on('close', async (code) => {
            if (code === 0) { // Chỉ gửi file nếu quá trình thành công (exit code = 0)
                try {
                    // Kiểm tra xem file có tồn tại không
                    if (fs.existsSync(outputPath)) {
                        await message.reply({
                            content: "✅ Hoàn tất! Đây là file MP3 của bạn:",
                            files: [outputPath],
                        });
                    } else {
                        await message.reply("❌ Không tìm thấy file audio.");
                    }
                } catch (err) {
                    console.error(err);
                    await message.reply("❌ Lỗi khi gửi file audio.");
                }
            } else {
                // Nếu có lỗi xảy ra trong quá trình chuyển đổi
                await message.reply("❌ Đã xảy ra lỗi khi xử lý video.");
            }
        
            // Xóa file sau 1 phút dù thành công hay thất bại
            setTimeout(() => {
                if (fs.existsSync(outputPath)) {
                    fs.unlinkSync(outputPath);
                    console.log(`Đã xóa file: ${outputFileName}`);
                }
            }, 10000);
        });
        console.log(`yt-dlp process PID: ${ytDlpEventEmitter.ytDlpProcess.pid}`);
}

module.exports = { convertMP3 };
