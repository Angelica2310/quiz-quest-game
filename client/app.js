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
const fiftyFiftyButton = document.getElementById("fifty-fifty-btn");
const audienceButton = document.getElementById("audience-btn");
let fiftyFiftyUsed = false;
let audienceUsed = false;

function saveQuizState(question = null) {
  const state = {
    currentQuestionIndex,
    lives,
    score,
    hintUsed: hintButton.disabled,
    fiftyFiftyUsed: fiftyFiftyButton.disabled,
    audienceUsed,
    question,
  };
  localStorage.setItem("quizState", JSON.stringify(state));
}

function loadQuizState() {
  const savedState = JSON.parse(localStorage.getItem("quizState"));
  if (savedState) {
    startScreen.style.display = "none";
    quizScreen.style.display = "block";
    currentQuestionIndex = savedState.currentQuestionIndex;
    lives = savedState.lives;
    score = savedState.score;
    livesCounter.textContent = lives;

    hintButton.disabled = savedState.hintUsed;
    hintDisplay.textContent = savedState.hintDisplayText;
    fiftyFiftyUsed = savedState.fiftyFiftyUsed;
    audienceUsed = savedState.audienceUsed;

    // Disable buttons if they were used
    if (fiftyFiftyUsed) fiftyFiftyButton.disabled = true;
    if (audienceUsed) audienceButton.disabled = true;

    displayQuestion(savedState.question);
  } else {
    getQuestion(); // Fetch a new question if no saved state exists
  }
}

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
  fiftyFiftyButton.disabled = false;
  audienceButton.disabled = false;
  fiftyFiftyUsed = false;
  audienceUsed = false;
  getQuestion();
}

// Fetch question from the server
async function getQuestion() {
  const response = await fetch(
    `https://quiz-quest-game-server.onrender.com/question${
      currentQuestionIndex + 1
    }`
  );
  const questions = await response.json();
  const randomIndex = Math.floor(Math.random() * questions.length);
  const question = questions[randomIndex];

  saveQuizState(question); // Save the question and state
  displayQuestion(question);
}

// Display question data
function displayQuestion(question) {
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
}

// Set up the hint button listener only once
hintButton.addEventListener("click", () => {
  const savedState = JSON.parse(localStorage.getItem("quizState"));
  if (savedState && savedState.question) {
    hintDisplay.textContent = savedState.question.hint;
  }
  hintButton.disabled = true;
  score--;
  saveQuizState(savedState.question);
});

// Add 50-50 button functionality once
fiftyFiftyButton.addEventListener("click", () => {
  const savedState = JSON.parse(localStorage.getItem("quizState"));
  const answerButtons = Array.from(document.querySelectorAll(".answer-btn"));
  const correctAnswer = savedState.question.correct_answer;

  // Identify the correct answer button
  const correctButton = answerButtons.find(
    (btn) => btn.getAttribute("data-option") === correctAnswer
  );

  // Filter only incorrect buttons
  const incorrectButtons = answerButtons.filter((btn) => btn !== correctButton);

  // Select two random incorrect buttons to hide
  const buttonsToHide = incorrectButtons.slice(0, 2);
  buttonsToHide.forEach((btn) => (btn.style.display = "none"));

  // Disable 50-50 button after use
  fiftyFiftyButton.disabled = true;
  fiftyFiftyUsed = true;
  score = score - 2;

  saveQuizState();
});

// Handle answer selection
function handleAnswerSelection(e, correctAnswer) {
  const selectedOption = e.target.getAttribute("data-option");

  if (selectedOption === correctAnswer) {
    e.target.classList.add("correct");
    score = score + 4;
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

  saveQuizState();

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
      saveQuizState();
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

// Restart the quiz with fresh state
function restartQuiz() {
  localStorage.clear(); // Clear all saved data
  currentQuestionIndex = 0;
  questionText.textContent = "";
  hintDisplay.textContent = "";
  fiftyFiftyUsed = false;
  audienceUsed = false;
  fiftyFiftyButton.disabled = false;
  audienceButton.disabled = false;
  questionCounter.textContent = "";
  answerOptions.innerHTML = "";

  // Hide end screen and show start screen
  endScreen.style.display = "none";
  startScreen.style.display = "block";
  quizScreen.style.display = "none";
}

// Restart the quiz
document.getElementById("restart-btn").addEventListener("click", restartQuiz);

// Load state on page load
window.onload = function () {
  loadQuizState();
};
