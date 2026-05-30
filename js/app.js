// Elements

const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");

const startBtn = document.getElementById("startBtn");
const nextBtn = document.getElementById("nextBtn");
const restartBtn = document.getElementById("restartBtn");

const questionText = document.getElementById("question");
const optionsBox = document.getElementById("options");

const questionCounter =
document.getElementById("questionCounter");

const progressBar =
document.getElementById("progressBar");

const timerEl =
document.getElementById("timer");

const finalScore =
document.getElementById("finalScore");

const accuracy =
document.getElementById("accuracy");

const leaderboard =
document.getElementById("leaderboard");

const usernameInput =
document.getElementById("username");

const themeToggle =
document.getElementById("themeToggle");


// Variables

let currentIndex = 0;
let score = 0;
let timer;
let timeLeft = 30;
let playerName = "";


// Start Quiz

startBtn.addEventListener("click", () => {

    playerName = usernameInput.value.trim();

    if (playerName === "") {
        alert("Please enter your name");
        return;
    }

    startScreen.classList.add("d-none");
    quizScreen.classList.remove("d-none");

    loadQuestion();
});


// Load Question

function loadQuestion() {

    clearInterval(timer);

    timeLeft = 30;
    startTimer();

    let currentQuestion =
    quizQuestions[currentIndex];

    questionText.textContent =
    currentQuestion.question;

    questionCounter.textContent =
    `Question ${currentIndex + 1} / ${quizQuestions.length}`;

    let progress =
    ((currentIndex) / quizQuestions.length) * 100;

    progressBar.style.width =
    `${progress}%`;

    optionsBox.innerHTML = "";

    currentQuestion.options.forEach(option => {

        let button =
        document.createElement("button");

        button.classList.add(
            "option-btn"
        );

        button.textContent = option;

        button.addEventListener("click", () => {
            checkAnswer(button, option);
        });

        optionsBox.appendChild(button);
    });

}


// Check Answer

function checkAnswer(button, selectedOption) {

    const correctAnswer =
    quizQuestions[currentIndex].answer;

    const allButtons =
    document.querySelectorAll(".option-btn");

    allButtons.forEach(btn => {
        btn.disabled = true;
    });

    if (selectedOption === correctAnswer) {

        button.classList.add("correct");
        score++;

    } else {

        button.classList.add("wrong");

        allButtons.forEach(btn => {

            if (
                btn.textContent === correctAnswer
            ) {
                btn.classList.add("correct");
            }

        });

    }

}


// Next Question

nextBtn.addEventListener("click", () => {

    currentIndex++;

    if (currentIndex < quizQuestions.length) {

        loadQuestion();

    } else {

        showResult();

    }

});


// Timer

function startTimer() {

    timerEl.textContent = `${timeLeft}s`;

    timer = setInterval(() => {

        timeLeft--;

        timerEl.textContent =
        `${timeLeft}s`;

        if (timeLeft <= 0) {

            clearInterval(timer);

            currentIndex++;

            if (
                currentIndex <
                quizQuestions.length
            ) {

                loadQuestion();

            } else {

                showResult();

            }

        }

    }, 1000);

}


// Show Result

function showResult() {

    clearInterval(timer);

    quizScreen.classList.add("d-none");

    resultScreen.classList.remove("d-none");

    progressBar.style.width = "100%";

    finalScore.textContent =
    `Score: ${score} / ${quizQuestions.length}`;

    let percentage =
    Math.round(
        (score / quizQuestions.length) * 100
    );

    accuracy.textContent =
    `Accuracy: ${percentage}%`;

    saveScore(
        playerName,
        percentage
    );

    loadLeaderboard();

}


// Restart

restartBtn.addEventListener("click", () => {

    currentIndex = 0;
    score = 0;

    resultScreen.classList.add("d-none");

    startScreen.classList.remove("d-none");

    usernameInput.value = "";

});


// Dark Mode

themeToggle.addEventListener("click", () => {

    document.body.classList.toggle(
        "light-mode"
    );

});


// Save Score

function saveScore(name, scoreValue) {

    let scores =
    JSON.parse(
        localStorage.getItem("quizScores")
    ) || [];

    scores.push({
        name: name,
        score: scoreValue
    });

    scores.sort(
        (a, b) => b.score - a.score
    );

    scores = scores.slice(0, 5);

    localStorage.setItem(
        "quizScores",
        JSON.stringify(scores)
    );

}


// Load Leaderboard

function loadLeaderboard() {

    leaderboard.innerHTML = "";

    let scores =
    JSON.parse(
        localStorage.getItem("quizScores")
    ) || [];

    if (scores.length === 0) {

        leaderboard.innerHTML =
        `
        <li class="list-group-item">
            No scores available
        </li>
        `;

        return;
    }

    scores.forEach(player => {

        let li =
        document.createElement("li");

        li.classList.add(
            "list-group-item"
        );

        li.innerHTML =
        `
        <strong>${player.name}</strong>
        - ${player.score}%
        `;

        leaderboard.appendChild(li);

    });

}