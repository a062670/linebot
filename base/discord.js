import { Client, GatewayIntentBits } from "discord.js";
import fs from "fs";
import path from "path";

import Message from "./message.js";

const __dirname = path.resolve();

const config = JSON.parse(
  fs.readFileSync(path.join(__dirname, "config", "discord.json"), "utf8")
);

class Discord {
  constructor(app) {
    this.init();
  }

  init() {
    const client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
      ],
    });

    client.on("ready", () => {
      console.log(`Logged in as ${client.user.tag}!`);
    });

    client.on("messageCreate", async (message) => {
      await this.handleEvent(message);
    });

    client.login(config.token);
  }

  async handleEvent(message) {
    try {
      const userId = message.author.id;
      const content = message.content;

      const reply = await Message.getReply(content, `discord-${userId}`);
      if (reply) {
        await message.reply(reply);
      }
    } catch (e) {}
  }
}

export default Discord;
