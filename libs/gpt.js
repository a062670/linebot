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
//   console.log(await getGptResponse("gpt hello"));
// })();

export async function getGptResponse(prompt) {
  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
    });
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
