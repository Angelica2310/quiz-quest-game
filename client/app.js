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
const timerDisplay = document.getElementById("timer");

//Global variables
let currentQuestionIndex = 0;
let lives = 3;
let score = 0;
let time = 10;
let countdown; //declaring countdown itself as a global variable

// Hint elements
const hintButton = document.getElementById("hint-btn");
const hintDisplay = document.createElement("p");
hintDisplay.id = "hint-display";
document.getElementById("question-section").appendChild(hintDisplay);

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
  endScreen.style.display = "none";
  const response = await fetch(
    `https://quiz-quest-game-server.onrender.com/question${
      currentQuestionIndex + 1
    }`
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

  startTimer();
}

// Handle answer selection
function handleAnswerSelection(e, correctAnswer) {
  const selectedOption = e.target.getAttribute("data-option");

  if (selectedOption === correctAnswer) {
    stopTimer();
    e.target.classList.add("correct");
    score++;
    nextButton.style.display = "block"; // Show the next button only when right answer is clicked
    const answerButtons = document.querySelectorAll(".answer-btn"); // Disable all answer buttons
    answerButtons.forEach((btn) => (btn.disabled = true));
  } else {
    e.target.classList.add("incorrect");
    lives--;
    livesCounter.textContent = lives;
  }

  // End quiz if lives are 0 or all questions are answered
  if (lives === 0 || currentQuestionIndex === 9) {
    stopTimer();
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
  if (time <= 0) {
    quizScreen.style.display = "none";
    endScreen.style.display = "block";
    document.getElementById("end-message").textContent = "You ran out of time!";
    document.getElementById(
      "final-score"
    ).textContent = `You finished the quiz with ${lives} lives left and a score of ${score}.`;
  } else if (lives === 0) {
    quizScreen.style.display = "none";
    endScreen.style.display = "block";
    document.getElementById("end-message").textContent =
      "You ran out of lives!";
    document.getElementById(
      "final-score"
    ).textContent = `You finished the quiz with a score of ${score}.`;
  } else {
    quizScreen.style.display = "none";
    endScreen.style.display = "block";
    document.getElementById("end-message").textContent = "Quiz Complete!";
    document.getElementById(
      "final-score"
    ).textContent = `You finished the quiz with ${lives} lives left and a score of ${score}!`;
  }
}

// Restart the quiz
document.getElementById("restart-btn").addEventListener("click", startQuiz);
