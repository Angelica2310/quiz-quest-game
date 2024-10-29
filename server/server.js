import express from "express";
import cors from "cors";
import pg from "pg";
import dotenv from "dotenv";

const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();

const db = new pg.Pool({ connectionString: process.env.DATABASE_URL });

app.get("/", function (request, response) {
  response.json("Main root!");
});

app.get("/question1", async function (request, response) {
  const result = await db.query("SELECT * FROM quiz_quest_1");
  const question = result.rows;
  response.json(question);
});

app.get("/question2", async function (request, response) {
  const result = await db.query("SELECT * FROM quiz_quest_2");
  const question = result.rows;
  response.json(question);
});

app.get("/question3", async function (request, response) {
  const result = await db.query("SELECT * FROM quiz_quest_3");
  const question = result.rows;
  response.json(question);
});

app.get("/question4", async function (request, response) {
  const result = await db.query("SELECT * FROM quiz_quest_4");
  const question = result.rows;
  response.json(question);
});

app.get("/question5", async function (request, response) {
  const result = await db.query("SELECT * FROM quiz_quest_5");
  const question = result.rows;
  response.json(question);
});

app.get("/question6", async function (request, response) {
  const result = await db.query("SELECT * FROM quiz_quest_6");
  const question = result.rows;
  response.json(question);
});

app.get("/question7", async function (request, response) {
  const result = await db.query("SELECT * FROM quiz_quest_7");
  const question = result.rows;
  response.json(question);
});

app.get("/question8", async function (request, response) {
  const result = await db.query("SELECT * FROM quiz_quest_8");
  const question = result.rows;
  response.json(question);
});

app.get("/question9", async function (request, response) {
  const result = await db.query("SELECT * FROM quiz_quest_9");
  const question = result.rows;
  response.json(question);
});

app.get("/question10", async function (request, response) {
  const result = await db.query("SELECT * FROM quiz_quest_10");
  const question = result.rows;
  response.json(question);
});

app.listen(8080, function () {
  console.log("App is running on PORT 8080");
});
