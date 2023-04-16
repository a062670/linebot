import fs from "fs";
import path from "path";
import axios from "axios";
import WebSocket from "ws";

const __dirname = path.resolve();

const config = JSON.parse(
  fs.readFileSync(path.join(__dirname, "config", "bing.json"), "utf8")
);

const axiosInstance = axios.create({
  baseURL: "https://www.bing.com",
  headers: {
    "content-type": "application/json",
    referer: "https://www.bing.com/",
    origin: "https://www.bing.com",
    cookie: config.cookie,
    "x-forwarded-for": "111.255.18.140",
    "user-agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36 Edg/110.0.1587.50",
  },
});

const conversations = {};

const getResponse = async (prompt, key) => {
  try {
    if (!conversations[key]) {
      conversations[key] = await createConversation();
    }
    if (prompt.toLowerCase() === "new") {
      conversations[key] = await createConversation();
      return "建立新的聊天串(bing)";
    }
  } catch (error) {
    return `建立新的聊天串失敗(bing): ${error.message}`;
  }
  try {
    const conversation = conversations[key];
    const res = await generate(conversation, prompt);
    return res;
  } catch (error) {
    return `錯誤(bing): ${error.message}`;
  }
};

const createConversation = async () => {
  const response = await axiosInstance.get("/turing/conversation/create");
  const data = response.data;

  if (data.result?.value !== "Success") {
    throw new Error(`建立聊天室失敗: ${JSON.stringify(data)}`);
  }

  return {
    invocationId: 0,
    conversationId: data.conversationId,
    clientId: data.clientId,
    conversationSignature: data.conversationSignature,
  };
};

const generate = async (conversation, prompt) => {
  const { invocationId, conversationId, clientId, conversationSignature } =
    conversation;
  const text = prompt + "\n請使用正體中文回答。";

  const ws = new WebSocket("wss://sydney.bing.com/sydney/ChatHub", {
    perMessageDeflate: false,
  });

  let data = "";

  await new Promise((resolve, reject) => {
    let timeout = setTimeout(() => {
      ws.close();
      reject(new Error("Socket: Timeout 惹"));
    }, 30 * 1000);

    ws.on("error", () => {
      if (timeout) clearTimeout(timeout);
      reject(new Error("Socket: Error 惹"));
    });

    ws.on("close", () => {
      if (timeout) clearTimeout(timeout);
    });

    ws.on("open", async () => {
      ws.send(packJson({ protocol: "json", version: 1 }));
      ws.send(packJson({ type: 6 }));
      ws.send(
        packJson({
          arguments: [
            {
              source: "cib",
              optionsSets: [],
              allowedMessageTypes: ["Chat"],
              sliceIds: [],
              traceId: "",
              isStartOfSession: invocationId === 0,
              message: {
                locale: "zh-TW",
                market: "zh-TW",
                region: "TW",
                location: "",
                locationHints: [],
                timestamp: new Date().toISOString(),
                author: "user",
                inputMethod: "Keyboard",
                text: text,
                messageType: "Chat",
              },
              conversationSignature: conversationSignature,
              participant: { id: clientId },
              conversationId: conversationId,
            },
          ],
          invocationId: invocationId.toString(),
          target: "chat",
          type: 4,
        })
      );
    });

    ws.on("message", (message) => {
      try {
        let response = message.toString();
        response = response.slice(0, -1);
        let json = JSON.parse(response);

        switch (json.type) {
          case 1:
            let jsonObj = json.arguments[0].messages[0];
            let textData = jsonObj.text;

            if (!textData.includes("Searching the web")) {
              if (!jsonObj.messageType) {
                data = textData;
              }

              if (timeout) clearTimeout(timeout);

              timeout = setTimeout(() => {
                ws.close();
                resolve("Resolved by timeout");
              }, 3 * 1000);
            }

            break;

          case 2:
            if (json.item?.result?.error)
              reject(new Error(json.item.result.error));
            if (json.item?.result?.value === "InvalidSession")
              reject(new Error("Invalid session, please generate again"));

            if (!data) {
              let botMessage = json.item.messages?.find(
                (m) => m.author === "bot"
              );

              if (botMessage && botMessage.hiddenText) {
                data = botMessage.hiddenText;
              }
            }
            break;

          case 7:
            ws.close();
            resolve("Maybe resolved");
            break;
        }

        if (json.error) {
          ws.close();
          reject(new Error(json.error));
        }
      } catch (e) {}
    });
  });

  conversation.invocationId += 1;

  if (!data) throw new Error("機器人不想理你");

  return data;
};

const packJson = (data) => {
  return JSON.stringify(data) + "";
};

// (async function () {
//   console.log(await getResponse("new", "test"));
// })();

export default {
  getResponse,
};
