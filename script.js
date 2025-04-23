// Game state
const gameState = {
    currentPuzzle: 0,
    startTime: null,
    timerInterval: null,
    puzzles: [
        {
            title: "Phishing Email",
            file: "puzzles/phishing.html",
            answer: "invoice",
            hint: "Check the email headers and links"
        },
        {
            title: "Encryption Challenge",
            file: "puzzles/encryption.html",
            answer: "caesar",
            hint: "Try shifting letters in the alphabet"
        },
        {
            title: "Network Intrusion",
            file: "puzzles/network.html",
            answer: "port22",
            hint: "Look for open ports in the scan results"
        },
        {
            title: "Social Engineering",
            file: "puzzles/social.html",
            answer: "mothersmaiden",
            hint: "What personal information is being shared?"
        }
    ]
};

// DOM elements
const elements = {
    introScreen: document.getElementById('intro-screen'),
    puzzleContainer: document.getElementById('puzzle-container'),
    successScreen: document.getElementById('success-screen'),
    startBtn: document.getElementById('start-btn'),
    submitAnswer: document.getElementById('submit-answer'),
    restartBtn: document.getElementById('restart-btn'),
    puzzleTitle: document.getElementById('puzzle-title'),
    puzzleContent: document.getElementById('puzzle-content'),
    puzzleFeedback: document.getElementById('puzzle-feedback'),
    puzzleAnswer: document.getElementById('puzzle-answer'),
    timer: document.getElementById('timer'),
    finalTime: document.getElementById('final-time'),
    completionCode: document.getElementById('code')
};

// Event listeners
elements.startBtn.addEventListener('click', startGame);
elements.submitAnswer.addEventListener('click', checkAnswer);
elements.restartBtn.addEventListener('click', resetGame);

// Start the game
function startGame() {
    elements.introScreen.classList.add('hidden');
    elements.puzzleContainer.classList.remove('hidden');
    
    // Start timer
    gameState.startTime = new Date();
    gameState.timerInterval = setInterval(updateTimer, 1000);
    
    // Load first puzzle
    loadPuzzle(gameState.currentPuzzle);
}

// Load a puzzle
function loadPuzzle(index) {
    const puzzle = gameState.puzzles[index];
    elements.puzzleTitle.textContent = puzzle.title;
    elements.puzzleAnswer.value = '';
    elements.puzzleFeedback.textContent = '';
    
    // Load puzzle content
    fetch(puzzle.file)
        .then(response => response.text())
        .then(html => {
            elements.puzzleContent.innerHTML = html;
        });
}

// Check answer
function checkAnswer() {
    const puzzle = gameState.puzzles[gameState.currentPuzzle];
    const userAnswer = elements.puzzleAnswer.value.trim().toLowerCase();
    
    if (userAnswer === puzzle.answer) {
        elements.puzzleFeedback.textContent = "Correct!";
        elements.puzzleFeedback.style.color = "#4ade80";
        
        // Move to next puzzle or end game
        gameState.currentPuzzle++;
        
        if (gameState.currentPuzzle < gameState.puzzles.length) {
            setTimeout(() => loadPuzzle(gameState.currentPuzzle), 1000);
        } else {
            endGame();
        }
    } else {
        elements.puzzleFeedback.textContent = "Incorrect. Hint: " + puzzle.hint;
        elements.puzzleFeedback.style.color = "#f87171";
    }
}

// Update timer
function updateTimer() {
    const now = new Date();
    const elapsed = new Date(now - gameState.startTime);
    const minutes = 29 - elapsed.getMinutes();
    const seconds = 59 - elapsed.getSeconds();
    
    elements.timer.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    // End game if time runs out
    if (minutes <= 0 && seconds <= 0) {
        endGame(false);
    }
}

// End the game
function endGame(success = true) {
    clearInterval(gameState.timerInterval);
    elements.puzzleContainer.classList.add('hidden');
    elements.successScreen.classList.remove('hidden');
    
    if (success) {
        const now = new Date();
        const elapsed = new Date(now - gameState.startTime);
        const minutes = elapsed.getMinutes();
        const seconds = elapsed.getSeconds();
        
        elements.finalTime.textContent = `${minutes}m ${seconds}s`;
        
        // Generate completion code
        const code = Math.floor(1000 + Math.random() * 9000);
        elements.completionCode.textContent = code;
    } else {
        document.querySelector('#success-screen h2').textContent = "Mission Failed!";
        document.querySelector('#success-screen p').textContent = "The hacker succeeded in breaching our systems.";
        elements.finalTime.textContent = "00:00";
        elements.completionCode.textContent = "TRY-AGAIN";
    }
}

// Reset the game
function resetGame() {
    gameState.currentPuzzle = 0;
    elements.successScreen.classList.add('hidden');
    elements.introScreen.classList.remove('hidden');
}
