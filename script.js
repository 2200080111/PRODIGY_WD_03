let currentPlayer;
let gameBoard;
let isGameOver = false;
let mode;
let gridSize;

function chooseCoin(coin) {
    currentPlayer = coin;
    document.getElementById("step1").style.display = "none";
    document.getElementById("step2").style.display = "block";
}

function chooseMode(selectedMode) {
    mode = selectedMode;
    document.getElementById("step2").style.display = "none";
    document.getElementById("step3").style.display = "block";
}

function chooseGridSize(size) {
    gridSize = size;
    document.getElementById("step3").style.display = "none";
    initializeBoard(size);
}

function initializeBoard(size) {
    gameBoard = Array.from(Array(size), () => Array(size).fill(''));
    displayBoard(size);
    isGameOver = false;
    document.getElementById("gameBoard").style.display = "grid"; // Ensure board is displayed
    document.getElementById("controls").style.display = "block"; // Show controls

    if (mode === 'computer' && currentPlayer === 'O') {
        setTimeout(computerMove, 500);
    }
}

function displayBoard(size) {
    let boardHTML = '';
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            boardHTML += `<div class="cell" id="cell_${i}_${j}" onclick="cellClicked(${i},${j})"></div>`;
        }
    }
    const gameBoardDiv = document.getElementById("gameBoard");
    gameBoardDiv.innerHTML = boardHTML;
    gameBoardDiv.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    gameBoardDiv.style.gridTemplateRows = `repeat(${size}, 1fr)`;
}

function cellClicked(row, col) {
    if (gameBoard[row][col] || isGameOver) return;

    gameBoard[row][col] = currentPlayer;
    document.getElementById(`cell_${row}_${col}`).textContent = currentPlayer;

    if (checkWinner(currentPlayer)) {
        announceWinner(currentPlayer);
        isGameOver = true;
    } else if (checkDraw()) {
        announceDraw();
        isGameOver = true;
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        if (mode === 'computer' && currentPlayer === 'O') {
            setTimeout(computerMove, 500);
        }
    }
}

function checkWinner(player) {
    for (let i = 0; i < gridSize; i++) {
        if (gameBoard[i].every(cell => cell === player)) return true;
        if (gameBoard.map(row => row[i]).every(cell => cell === player)) return true;
    }
    if (gameBoard.map((row, index) => row[index]).every(cell => cell === player)) return true;
    if (gameBoard.map((row, index) => row[gridSize - 1 - index]).every(cell => cell === player)) return true;
    return false;
}

function checkDraw() {
    return gameBoard.every(row => row.every(cell => cell));
}

function announceWinner(winner) {
    let message = document.getElementById("message");
    message.innerHTML = `Player ${winner} wins! `;
    message.style.display = "block";
}

function announceDraw() {
    let message = document.getElementById("message");
    message.innerHTML = `It's a draw! `;
    message.style.display = "block";
}

function restartGame() {
    document.getElementById("message").style.display = "none";
    initializeBoard(gridSize); // Reinitialize the board with the same size
}

function goHome() {
    document.getElementById("message").style.display = "none";
    document.getElementById("controls").style.display = "none";
    document.getElementById("gameBoard").style.display = "none";
    document.getElementById("step1").style.display = "block";
    currentPlayer = '';
    gameBoard = [];
    isGameOver = false;
}

function computerMove() {
    let availableCells = [];
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            if (!gameBoard[i][j]) availableCells.push({ row: i, col: j });
        }
    }
    if (availableCells.length > 0) {
        let move = availableCells[Math.floor(Math.random() * availableCells.length)];
        cellClicked(move.row, move.col);
    }
}
