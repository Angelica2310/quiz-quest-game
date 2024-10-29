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
let questions = [];
// Function to fetch questions and answers and display them
async function easyQuiz() {
  const response = await fetch(
    "http://localhost:8080/questions?difficulty=easy"
  );
  const quiz = await response.json();
  questions = quiz;
  displayQuestion();
}
//   for (let i = 0; i < quiz.length; i++) {
//     const question = quiz[i].question;
//     const option_a = quiz[i].option_a;
//     const option_b = quiz[i].option_b;
//     const option_c = quiz[i].option_c;
//     const option_d = quiz[i].option_d;
//   }
function displayQuestion() {
  // Select a random question

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
async function handleClick(event) {
  if (event.target.value === questions[currentQuestionIndex].correct_answer) {
    console.log("correct, fetch");
    currentQuestionIndex++;
    displayQuestion();
    // Fetch and display next question
  } else {
    alert("Incorrect answer! Try again.");
  }
}

// Add event listener to check if the answer is correct
optionA.addEventListener("click", handleClick);
optionB.addEventListener("click", handleClick);
optionC.addEventListener("click", handleClick);
optionD.addEventListener("click", handleClick);

easyQuiz();
