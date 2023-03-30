import express from "express";
import Line from "./base/line.js";
import Discord from "./base/discord.js";

const app = express();

app.listen(80);

new Line(app);
new Discord();
