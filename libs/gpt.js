import fs from "fs";
import path from "path";
import { Configuration, OpenAIApi } from "openai";

const __dirname = path.resolve();

const config = JSON.parse(
  fs.readFileSync(path.join(__dirname, "configGpt.json"), "utf8")
);

const configuration = new Configuration({
  organization: config.orgId,
  apiKey: config.apiKey,
});
const openai = new OpenAIApi(configuration);

// (async function () {
//   console.log(await getGptResponse("給我一段隨機的 js 程式碼片段"));
// })();

export async function getGptResponse(prompt) {
  try {
    const req = {
      model: "text-davinci-003",
      prompt: prompt,
      max_tokens: 1000,
    };
    // const req = {
    //   model: "gpt-3.5-turbo",
    //   messages: [{ role: "user", content: prompt }],
    //   temperature: 0.7,
    // };
    const completion = await openai.createCompletion(req);
    return completion.data.choices[0].text;
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
