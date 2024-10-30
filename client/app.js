let quizContainer = document.getElementById("quiz-container");

// Function to fetch questions and answers and display them
async function getQuiz() {
  const response = await fetch("http://localhost:8080/random-questions");
  const quiz = await response.json();

  // Select a random question
  // const randomIndex = Math.floor(Math.random() * quiz1.length);
  // const question = quiz1[randomIndex].question;
  // const options = [
  //   quiz1[randomIndex].option_a,
  //   quiz1[randomIndex].option_b,
  //   quiz1[randomIndex].option_c,
  //   quiz1[randomIndex].option_d,
  // ];
  // const correctAnswer = quiz1[randomIndex].correct_answer;

  // Clear previous question
  quizContainer.innerHTML = "";

  // Create element for each questions and its answers
  const questionContainer = document.createElement("div");
  questionContainer.classList.add("question");

  const questionText = document.createElement("h3");
  questionText.textContent = question;
  questionContainer.appendChild(questionText);

  // Create 4 choices of answer
  options.forEach((option) => {
    const optionContainer = document.createElement("div");
    const optionText = document.createElement("input");
    optionText.type = "radio";
    optionText.name = "question";
    optionText.value = option;

    const optionLabel = document.createElement("label");
    optionLabel.textContent = option;

    optionContainer.appendChild(optionText);
    optionContainer.appendChild(optionLabel);
    questionContainer.appendChild(optionContainer);

    // Add event listener to check if the answer is correct
    // optionText.addEventListener("change", async () => {
    //   if (optionText.value === correctAnswer) {
    //     console.log("correct, fetch");
    //     // Fetch and display next question
    //     await fetch("http://localhost:8080/question2");
    //   } else {
    //     alert("Incorrect answer! Try again.");
    //   }
    // });
  });

  // Append the question container to the main quiz container
  quizContainer.appendChild(questionContainer);
}

getQuiz();
