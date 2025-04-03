# Mục lục
1. [Thông tin](#thông-tin)
2. [Cấu hình Discord-Bot](#cấu-hình-discord-bot)
3. [Một vài thứ cần nói](#một-vài-thứ-cần-nói)
4. [Lưu ý](#lưu-ý)

## Thông tin
  Bot được làm bởi JukisYuri, Model: Qwen/Qwen2.5-Coder-32B-Instruct.
  Được viết bởi sinh viên năm 2 vẫn đang học trong trường, nên sẽ còn nhiều sai sót
  
## Cấu hình Discord-Bot
1. Tải (hoặc clone) repo này về
2. Trong file .env
   ```env
   BOT_TOKEN= {Discord Bot token của bạn}
   HUGGINGFACE_TOKEN= {HuggingFace token của bạn}
   ```
       Cách lấy BOT_TOKEN? https://discord.com/developers/docs/intro
       Cách lấy HUGGINGFACE_TOKEN? https://huggingface.co/
3. Cài đặt các Dependencies từ file package (bắt buộc phải cài NodeJS từ trước)
  ```sh
  npm install 
  ```
4. Bắt đầu chạy bot thông qua lệnh 
```sh
node index.js
```

## Một vài thứ cần nói
1. Tệp index.js là tệp chính để khởi động con bot trong Discord
2. Bạn có thể tự mình tiếp tục phát triển thêm dự án của riêng bạn sau khi clone về (vì đây là mã nguồn mở) hoặc contribute thêm tại repo này
3. Tệp tutorial.js dùng để chứa những câu lệnh hướng dẫn cách dùng thông qua lệnh ! help
   
   ![image](https://github.com/user-attachments/assets/4c317c09-8fd9-4d1f-a759-812705b9e556)
4. Bạn có thể đặt câu hỏi thông qua cú pháp: ! {câu hỏi}

   ![image](https://github.com/user-attachments/assets/66fb07e3-6b19-4b91-aa69-b95cc98028f6)


## Lưu ý
1. Bot được sử dụng model nguyên mẫu, không qua train model
2. Sử dụng API đến từ DiscordJS, được viết hoàn toàn bằng NodeJS
3. Model không thuộc quyền sở hữu của JukisYuri
4. Có thể góp ý và trò chuyện với mình trên **Discord: jukisyuri**
