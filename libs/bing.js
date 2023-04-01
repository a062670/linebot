import fs from "fs";
import path from "path";
import { BingChat } from "bing-chat";

const __dirname = path.resolve();

const config = JSON.parse(
  fs.readFileSync(path.join(__dirname, "config", "bing.json"), "utf8")
);

const api = new BingChat({
  cookie: config.cookie,
});

const getResponse = async (message) => {
  try {
    const res = await api.sendMessage(message + "\n請使用正體中文回答。");
    return res.text;
  } catch (error) {
    return "錯誤(bing)";
  }
};

// (async () => {
//   const res = await getResponse("你好");
//   console.log(res);
// })();

export default {
  getResponse,
};
