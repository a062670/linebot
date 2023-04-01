import line from "@line/bot-sdk";
import fs from "fs";
import path from "path";

import Message from "./message.js";

const __dirname = path.resolve();

const config = JSON.parse(
  fs.readFileSync(path.join(__dirname, "config", "line.json"), "utf8")
);

const client = new line.Client(config);

class Line {
  constructor(app) {
    this.app = app;
    this.init();
  }

  init() {
    this.app.post("/line-webhook", line.middleware(config), (req, res) => {
      Promise.all(req.body.events.map(this.handleEvent)).then((result) =>
        res.json(result)
      );
    });
  }

  async handleEvent(event) {
    if (event.type !== "message" || event.message.type !== "text") {
      return null;
    }

    const userId = event.source.userId;
    const content = event.message.text;
    const reply = await Message.getReply(content, `line-${userId}`);

    if (reply) {
      const message = {
        type: "text",
        text: reply,
      };

      return client.replyMessage(event.replyToken, message);
    }

    return null;
  }
}

export default Line;
