const express = require("express");
const line = require("@line/bot-sdk");
const fs = require("fs");

const config = JSON.parse(fs.readFileSync("config.json", "utf8"));

const client = new line.Client(config);

const app = express();

app.post("/webhook", line.middleware(config), (req, res) => {
  Promise.all(req.body.events.map(handleEvent)).then((result) =>
    res.json(result)
  );
});

function handleEvent(event) {
  if (event.type !== "message" || event.message.type !== "text") {
    return Promise.resolve(null);
  }

  const message = {
    type: "text",
    text: "Hello, world!",
  };

  return client.replyMessage(event.replyToken, message);
}

app.listen(80);
