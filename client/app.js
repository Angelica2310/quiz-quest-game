const quizContainer = document.getElementById("quiz-container");
const nextBtn = document.getElementById("next-btn");
let currentQuestionIndex = 0;
const questionText = document.getElementById("question-text");
const optionA = document.getElementById("option-a");
const optionB = document.getElementById("option-b");
const optionC = document.getElementById("option-c");
const optionD = document.getElementById("option-d");
const labelA = document.getElementById("label-a");
const labelB = document.getElementById("label-b");
const labelC = document.getElementById("label-c");
const labelD = document.getElementById("label-d");
const questionNumber = document.querySelector(".question-number");
const score = document.querySelector(".score");

let questionNumberDisplay = 1;
let questions = [];
let scoreDisplay = 0;

// Function to fetch easy questions and answers
async function easyQuiz() {
  const response = await fetch(
    "https://quiz-quest-game-server.onrender.com/questions?difficulty=easy"
  );
  const quiz = await response.json();
  questions = quiz;
  displayQuestion();
}

// Function to fetch medium questions and answers
async function mediumQuiz() {
  const response = await fetch(
    "https://quiz-quest-game-server.onrender.com/questions?difficulty=medium"
  );
  const quiz = await response.json();
  questions = quiz;
  displayQuestion();
}

// Function to fetch hard questions and answers
async function hardQuiz() {
  const response = await fetch(
    "https://quiz-quest-game-server.onrender.com/questions?difficulty=hard"
  );
  const quiz = await response.json();
  questions = quiz;
  displayQuestion();
}

// Function to fetch extremely hard questions and answers
async function extremelyhardQuiz() {
  const response = await fetch(
    "https://quiz-quest-game-server.onrender.com/questions?difficulty=extremely%20hard"
  );
  const quiz = await response.json();
  questions = quiz;
  displayQuestion();
}

// Function to display questions and answers
function displayQuestion() {
  const question = questions[currentQuestionIndex].question;

  let correctAnswer = questions[currentQuestionIndex].correct_answer;
  console.log(correctAnswer);

  questionText.textContent = question;

  optionA.value = questions[currentQuestionIndex].option_a;
  labelA.textContent = questions[currentQuestionIndex].option_a;

  optionB.value = questions[currentQuestionIndex].option_b;
  labelB.textContent = questions[currentQuestionIndex].option_b;

  optionC.value = questions[currentQuestionIndex].option_c;
  labelC.textContent = questions[currentQuestionIndex].option_c;

  optionD.value = questions[currentQuestionIndex].option_d;
  labelD.textContent = questions[currentQuestionIndex].option_d;
}

// Function to move to the next question when correct answer is selected
async function handleClick(event) {
  if (event.target.value === questions[currentQuestionIndex].correct_answer) {
    console.log("correct, fetch");
    currentQuestionIndex++;
    questionNumberDisplay++;
    questionNumber.textContent = questionNumberDisplay;
    scoreDisplay = scoreDisplay + 4;
    score.textContent = scoreDisplay;
    displayQuestion();
  } else {
    alert("Incorrect answer! Try again.");
  }
}

// Add event listener to check if the answer is correct
optionA.addEventListener("click", handleClick);
optionB.addEventListener("click", handleClick);
optionC.addEventListener("click", handleClick);
optionD.addEventListener("click", handleClick);

// easyQuiz();

// Function for game level button
const easyBtn = document.querySelector(".easy-btn");
const mediumBtn = document.querySelector(".medium-btn");
const hardBtn = document.querySelector(".hard-btn");
const extremelyHardBtn = document.querySelector(".extremelyhard-btn");
const lifelineContainer = document.querySelector(".lifeline-container");
const statusContainer = document.querySelector(".status-container");
const homeBtn = document.querySelector(".home-btn");
const levelBtn = document.querySelector(".level-btn");

// Function when click HOME button, go back to intro page
homeBtn.addEventListener("click", function () {
  levelBtn.style.display = "block";
  lifelineContainer.style.display = "none";
  quizContainer.style.display = "none";
  statusContainer.style.display = "none";
});

function hideContent() {
  lifelineContainer.style.display = "block";
  quizContainer.style.display = "block";
  statusContainer.style.display = "block";
}

// function resetDisplay() {
//   scoreDisplay.innerText = "0";
//   questionNumberDisplay.innertext = "1";
// }

// function resetSpan() {
//   score.innerHTML = "0";
//   questionNumber.innerHTML = "1";
// }

// Function when click easy button
easyBtn.addEventListener("click", function () {
  levelBtn.style.display = "none";
  hideContent();
  easyQuiz();
});

// Function when click medium button
mediumBtn.addEventListener("click", function () {
  levelBtn.style.display = "none";
  hideContent();
  mediumQuiz();
});

// Function when click hard button
hardBtn.addEventListener("click", function () {
  levelBtn.style.display = "none";
  hideContent();
  hardQuiz();
});

// Function when click extremely hard button
extremelyHardBtn.addEventListener("click", function () {
  levelBtn.style.display = "none";
  hideContent();
  extremelyhardQuiz();
});
