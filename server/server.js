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

// POST request to insert name and score into database
app.post("/leaderboard", async function (request, response) {
  const { name, score } = request.body;
  console.log(name, score);
  const result = await db.query(
    "INSERT INTO leaderboard(name, score) VALUES ($1, $2) RETURNING id",
    [name, score]
  );
  response.json(result.rows[0]);
});

// GET request to get name and score from database
app.get("/leaderboard", async function (request, response) {
  const result = await db.query(
    "SELECT * FROM leaderboard ORDER BY score DESC"
  );
  response.json(result.rows);
});

// PUT request to update score in database
app.put("/leaderboard/:id", async function (request, response) {
  const { id } = request.params;
  const { score } = request.body;
  console.log(id, score);
  const result = await db.query(
    "UPDATE leaderboard SET score = $1 WHERE id = $2",
    [score, id]
  );
  if (result.rowCount === 0) {
    return response.json({ error: "Score not found" });
  }
  response.json({ message: "Score updated!" });
});

app.listen(8080, () => {
  console.log("App is running on PORT 8080");
});
