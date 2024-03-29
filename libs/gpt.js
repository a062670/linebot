import fs from "fs";
import path from "path";
import { Configuration, OpenAIApi } from "openai";

const __dirname = path.resolve();

const config = JSON.parse(
  fs.readFileSync(path.join(__dirname, "config", "gpt.json"), "utf8")
);

const configuration = new Configuration({
  organization: config.orgId,
  apiKey: config.apiKey,
});
const openai = new OpenAIApi(configuration);

const messages = {};

// (async function () {
//   console.log(await getGptResponse("給我一段隨機的 js 程式碼片段", "test"));
// })();

export async function getGptResponse(prompt, key) {
  if (!messages[key]) {
    messages[key] = [];
  }
  if (prompt.toLowerCase() === "new") {
    messages[key] = [];
    return "建立新的聊天串";
  }

  try {
    const message = messages[key];
    message.push({ role: "user", content: prompt });
    const req = {
      model: "gpt-4",
      messages: message,
      max_tokens: 1000,
      temperature: 0.7,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    };
    const completion = await openai.createChatCompletion(req);
    const completion_text = completion.data.choices[0].message.content;

    // 回復存入列表
    message.push(completion.data.choices[0].message);
    // 只留 6 個
    message.splice(0, message.length - 6);

    return completion_text;
  } catch (error) {
    if (error.response) {
      return `${error.response.status} ${error.response.data}`;
    } else {
      return error.message;
    }
  }
}

export default {
  getGptResponse,
};
