import express from "express";
import Line from "./base/line.js";

const app = express();

app.listen(80);

new Line(app);
