const quizContainer = document.getElementById("quiz-container");
const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const endScreen = document.getElementById("end-screen");
const questionText = document.getElementById("question-text");
const answerOptions = document.getElementById("answer-options");
const questionCounter = document.getElementById("question-counter");
const livesCounter = document.getElementById("lives");
const scoreCounter = document.getElementById("score");
const nextButton = document.getElementById("next-btn");
const startButton = document.getElementById("start-btn");
const restartButton = document.getElementById("restart-btn");
const leaderboard = document.getElementById("leaderboard");
const leaderboardButton = document.querySelector(".leaderboard-button");
const finalScore = document.getElementById("final-score");
const timerDisplay = document.getElementById("timer");

//Global variables
let currentScore = 0;
let currentID = {};
let userName;
let currentQuestionIndex = 0;
let lives = 3;
let time = 10;
let countdown; //declaring countdown itself as a global variable

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
    currentScore,
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
    currentScore = savedState.currentScore;
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

// Timer functions
function startTimer() {
  clearInterval(countdown);
  time = 10;
  timerDisplay.textContent = `Time: ${time}s`;

  countdown = setInterval(() => {
    time--;
    timerDisplay.textContent = `Time: ${time}s`;

    if (time <= 0) {
      clearInterval(countdown);
      endQuiz();
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(countdown);
  timerDisplay.textContent = "";
}

// Start the quiz
function startQuiz() {
  startScreen.style.display = "none";
  quizScreen.style.display = "block";
  endScreen.style.display = "none";
  leaderboardButton.style.display = "block";
  currentQuestionIndex = 0;
  lives = 3;
  currentScore = 0;
  livesCounter.textContent = lives;
  scoreCounter.textContent = currentScore;
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
  endScreen.style.display = "none";
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

  startTimer();
}

// Set up the hint button listener only once
hintButton.addEventListener("click", () => {
  const savedState = JSON.parse(localStorage.getItem("quizState"));
  if (savedState && savedState.question) {
    hintDisplay.textContent = savedState.question.hint;
  }
  hintButton.disabled = true;
  currentScore--;
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
  currentScore = currentScore - 2;

  saveQuizState();
});

// Handle answer selection
function handleAnswerSelection(e, correctAnswer) {
  const selectedOption = e.target.getAttribute("data-option");

  if (selectedOption === correctAnswer) {
    stopTimer();
    e.target.classList.add("correct");
    currentScore = currentScore + 4;
    scoreCounter.textContent = currentScore;
    nextButton.style.display = "block"; // Show the next button only when right answer is clicked
    const answerButtons = document.querySelectorAll(".answer-btn"); // Disable all answer buttons
    answerButtons.forEach((btn) => (btn.disabled = true));
  } else {
    e.target.classList.add("incorrect");
    lives--;
    livesCounter.textContent = lives;
    nextButton.style.display = "none";
  }

  // End quiz if lives are 0 or all questions are answered
  if (lives === 0 || currentQuestionIndex === 9) {
    stopTimer();
    endQuiz();
  }

  saveQuizState();
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
  if (time <= 0) {
    leaderboardButton.style.display = "none";
    quizScreen.style.display = "none";
    endScreen.style.display = "block";
    document.getElementById("end-message").textContent = "You ran out of time!";
    document.getElementById(
      "final-score"
    ).textContent = `You finished the quiz with ${lives} lives left and a score of ${currentScore}.`;
  } else if (lives === 0) {
    leaderboardButton.style.display = "none";
    quizScreen.style.display = "none";
    endScreen.style.display = "block";
    document.getElementById("end-message").textContent =
      "You ran out of lives!";
    document.getElementById(
      "final-score"
    ).textContent = `You finished the quiz with a score of ${currentScore}.`;
  } else {
    leaderboardButton.style.display = "none";
    quizScreen.style.display = "none";
    endScreen.style.display = "block";
    document.getElementById("end-message").textContent = "Quiz Complete!";
    document.getElementById(
      "final-score"
    ).textContent = `You finished the quiz with ${lives} lives left and a score of ${currentScore}!`;
  }
}

// Display score to leaderboard
async function getScore() {
  const response = await fetch("http://localhost:8080/leaderboard");
  const board = await response.json();

  for (let i = 0; i < Math.min(5, board.length); i++) {
    const name = board[i].name;
    const score = board[i].score;
    if (score !== null && score !== 0) {
      const scoreDiv = document.createElement("div");
      scoreDiv.classList.add("score-div");
      const p = document.createElement("p");
      console.log(p);
      p.textContent = `${name}: ${score}`;

      scoreDiv.appendChild(p);
      leaderboard.appendChild(scoreDiv);
    }
  }
}
getScore();

const p = document.createElement("p");
p.id = "score-message";

// Function to handle username submission
const username = document.getElementById("username");
const nameForm = document.getElementById("name-form");

async function handleSubmitName(e) {
  e.preventDefault();

  const formData = new FormData(nameForm);
  const formObj = Object.fromEntries(formData);
  userName = formObj.name;
  console.log(userName);
  const response = await fetch("http://localhost:8080/leaderboard", {
    method: "POST",
    body: JSON.stringify(formObj),
    headers: { "Content-Type": "application/json" },
  });

  const data = await response.json();
  currentID = data;
  console.log(data);
  nameForm.reset();
}
nameForm.addEventListener("submit", handleSubmitName);

// Function to generate the result
const generateResult = document.getElementById("result-btn");
const overlay = document.getElementById("overlay");
const popupDialog = document.getElementById("popupDialog");
const closeButton = document.getElementById("close-btn");
const certificate = document.getElementById("certificate");

function showPopup() {
  overlay.style.display = "block";
  popupDialog.style.display = "block";
  certificate.innerHTML = `Congratulations <span style="color: red; font-weight: bold;">${userName}</span> for completing this game with a score of <span style="color: green;">${currentScore}</span>!`;
}

function closePopup() {
  overlay.style.display = "none";
  popupDialog.style.display = "none";
}

generateResult.addEventListener("click", showPopup);
closeButton.addEventListener("click", closePopup);

overlay.addEventListener("click", closePopup);

// Function to hide leaderboard

function hideLeaderboard() {
  if (leaderboard) {
    if (
      leaderboard.style.display === "none" ||
      leaderboard.style.display === ""
    ) {
      leaderboard.style.display = "block";
    } else {
      leaderboard.style.display = "none";
    }
  }
}
leaderboardButton.addEventListener("click", hideLeaderboard);

// Restart the quiz with fresh state
async function restartQuiz() {
  // Update leaderboard
  const newScore = currentScore;
  const storeObj = { score: newScore };
  currentScore = storeObj;
  console.log(currentScore);
  const data = await fetch(
    `http://localhost:8080/leaderboard/${currentID.id}`,
    {
      method: "PUT",
      body: JSON.stringify(storeObj),
      headers: { "Content-Type": "application/json" },
    }
  );

  localStorage.clear();
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
