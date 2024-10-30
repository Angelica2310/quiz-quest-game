const quizContainer = document.getElementById("quiz-container");
const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const endScreen = document.getElementById("end-screen");
const questionText = document.getElementById("question-text");
const answerOptions = document.getElementById("answer-options");
const questionCounter = document.getElementById("question-counter");
const livesCounter = document.getElementById("lives");
const nextButton = document.getElementById("next-btn");
const startButton = document.getElementById("start-btn");
let currentQuestionIndex = 0;
let lives = 3;
let score = 0;

// Hint elements
const hintButton = document.getElementById("hint-btn");
const hintDisplay = document.createElement("p");
hintDisplay.id = "hint-display";
document.getElementById("question-section").appendChild(hintDisplay);

// Event listener for starting the quiz
startButton.addEventListener("click", startQuiz);

// Start the quiz
function startQuiz() {
  startScreen.style.display = "none";
  quizScreen.style.display = "block";
  currentQuestionIndex = 0;
  lives = 3;
  score = 0;
  livesCounter.textContent = lives;
  hintButton.disabled = false;
  hintDisplay.textContent = "";
  getQuestion();
}

// Fetch question from the server
async function getQuestion() {
  const response = await fetch(
    `https://quiz-quest-game-server.onrender.com/question${currentQuestionIndex + 1}`
  );
  const questions = await response.json();
  const randomIndex = Math.floor(Math.random() * questions.length);
  const question = questions[randomIndex];

  questionText.textContent = question.question;
  answerOptions.innerHTML = "";
  hintDisplay.textContent = "";
  const options = [
    { text: question.option_a, value: "A" },
    { text: question.option_b, value: "B" },
    { text: question.option_c, value: "C" },
    { text: question.option_d, value: "D" },
  ];

  options.forEach((option) => {
    const button = document.createElement("button");
    button.className = "answer-btn";
    button.textContent = option.text;
    button.setAttribute("data-option", option.value);
    button.addEventListener("click", (e) =>
      handleAnswerSelection(e, question.correct_answer)
    );
    answerOptions.appendChild(button);
  });

  questionCounter.textContent = `Question ${currentQuestionIndex + 1}/10`;

  hintButton.addEventListener("click", () => {
    hintDisplay.textContent = question.hint;
    hintButton.disabled = true;
  });
}

// Handle answer selection
function handleAnswerSelection(e, correctAnswer) {
  const selectedOption = e.target.getAttribute("data-option");

  if (selectedOption === correctAnswer) {
    e.target.classList.add("correct");
    score++;
  } else {
    e.target.classList.add("incorrect");
    lives--;
    livesCounter.textContent = lives;
  }

  // Disable all answer buttons
  const answerButtons = document.querySelectorAll(".answer-btn");
  answerButtons.forEach((btn) => (btn.disabled = true));

  // Show the next button
  nextButton.style.display = "block";

  // End quiz if lives are 0 or all questions are answered
  if (lives === 0 || currentQuestionIndex === 9) {
    endQuiz();
  }
}

// Move to the next question
nextButton.addEventListener("click", () => {
  if (lives > 0) {
    currentQuestionIndex++;
    if (currentQuestionIndex < 10) {
      getQuestion();
      nextButton.style.display = "none";
    } else {
      endQuiz();
    }
  }
});

// End the quiz
function endQuiz() {
  quizScreen.style.display = "none";
  endScreen.style.display = "block";
  document.getElementById(
    "final-score"
  ).textContent = `You completed the quiz with ${lives} lives left and a score of ${score}!`;
}

// Restart the quiz
document.getElementById("restart-btn").addEventListener("click", startQuiz);
