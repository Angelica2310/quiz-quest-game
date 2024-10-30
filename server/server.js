import express from "express";
import cors from "cors";
import pg from "pg";
import dotenv from "dotenv";

const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();

const db = new pg.Pool({ connectionString: process.env.DATABASE_URL });

app.get("/", (request, response) => {
  response.json("Main root!");
});

// Dynamic endpoint to fetch questions
app.get("/question:questionNumber", async (request, response) => {
  const questionNumber = request.params.questionNumber;
  const result = await db.query(`SELECT * FROM quiz_quest_${questionNumber}`);
  const questions = result.rows;
  response.json(questions);
});

app.listen(8080, () => {
  
  console.log("App is running on PORT 8080");
});
