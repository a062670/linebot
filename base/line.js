import line from "@line/bot-sdk";
import fs from "fs";
import path from "path";

import gpt from "./libs/gpt.js";

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

    if (event.message.text.toLowerCase().startsWith("gpt ")) {
      const resp = await gpt.getGptResponse(
        event.message.text.substring(4),
        `line-${event.source.userId}`
      );
      const message = {
        type: "text",
        text: resp.trim(),
      };

      return client.replyMessage(event.replyToken, message);
    }

    return null;
  }
}

export default Line;
