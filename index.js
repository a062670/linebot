import express from "express";
import Line from "./base/line";

const app = express();

app.listen(80);

new Line(app);
