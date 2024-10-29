import express from "express";
import cors from "cors";
import pg from "pg";
import dotenv from "dotenv";

const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();

app.get("/", function (request, response) {
  response.json("Main root!");
});

const db = new pg.Pool({ connectionString: process.env.DATABASE_URL });

app.get("/questions", async function (request, response) {
  const result = await db.query("SELECT * FROM quiz_quest");
  let questions = result.rows;

  const easyQuestion = request.query.difficulty;
  if (easyQuestion) {
    questions = questions.filter(function (question) {
      return question.difficulty === easyQuestion;
    });
  }
  response.json(questions);
});

app.listen(8080, function () {
  console.log("App is running on PORT 8080");
});
