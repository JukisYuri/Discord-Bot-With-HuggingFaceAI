const { splitMessage } = require('./helper/split_message')
const { HfInference } = require('@huggingface/inference');

const hf = new HfInference(process.env.HUGGINGFACE_TOKEN);

async function prompt(message) {
  const messageContent = message.content.replace("! ", "");
  await message.channel.sendTyping();
  const response = await hf.textGeneration({
    model: "Qwen/Qwen2.5-Coder-32B-Instruct",
    inputs: messageContent,
    parameters: {
      temperature: 0.7, // Độ sáng tạo
      top_p: 0.9, // Sự phong phú trong câu trả lời
      max_new_tokens: 2000,
    },
  });
  const messageChunks = splitMessage(response.generated_text.trim());
  for (const chunk of messageChunks) {
    await message.reply(chunk);
  }
}

module.exports = { prompt };