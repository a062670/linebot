import express from "express";
import line from "@line/bot-sdk";
import fs from "fs";

import gpt from "./libs/gpt.js";

const config = JSON.parse(fs.readFileSync("config.json", "utf8"));

const client = new line.Client(config);

const app = express();

app.post("/webhook", line.middleware(config), (req, res) => {
  Promise.all(req.body.events.map(handleEvent)).then((result) =>
    res.json(result)
  );
});

async function handleEvent(event) {
  if (event.type !== "message" || event.message.type !== "text") {
    return null;
  }

  if (event.message.text.toLowerCase().startsWith("gpt")) {
    const message = {
      type: "text",
      text: await gpt.getGptResponse(event.message.text),
    };

    return client.replyMessage(event.replyToken, message);
  }

  return null;
}

app.listen(80);
