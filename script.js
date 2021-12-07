const gameboard = (() => {
    let boardArr = [[],[],[],[],[],[],[],[],[]];
    return {boardArr};
})();

const gameController = (() => {
    winState = false;
    tieState = false;
    let gameMode = "computer";
    let currentTurn = 'x';

    const getCurrentTurn = () => currentTurn;

    const switchTurn = () => {
        if (currentTurn == 'x') currentTurn = 'o';
        else currentTurn = 'x';
        playerTurn();
    }

    const mark = (index) => {
        gameboard.boardArr[index] = currentTurn;
        displayController.updateDisplay(gameboard.boardArr)
        switchTurn();
        if (gameMode == "computer" && currentTurn == "o") {
            computer.bestMove();  
        }  
    }

    const tieCheck = () => {
        let a = gameboard.boardArr.every(i => i.length > 0 && winState == false);
        if (a) displayController.tie();
    }
    
    const winCheck = () => {
        let board = gameboard.boardArr;
        if (board[0].length > 0) {
            diagonal(0, board[0], board);
            horizontal(0, board[0], board);
            vertical(0, board[0], board);
        } 
        if (board[2].length > 0) {
            diagonal(2, board[2], board);
        } 
        for (let i = 1; i <= 2; i++) {
            if (board[i].length > 0) {
                vertical(i, board[i], board)
            }
        }
        for (let i = 3; i <= 6; i += 3) {
            if (board[i].length > 0) {
                horizontal(i, board[i], board)
            } 
        }
    }

    const horizontal = (i, sign, board) => {
        if (board[i+1] == sign && board[i+2] == sign) gameEnd(sign);
    }
    const vertical = (i, sign, board) => {
        if (board[i+3] == sign && board[i+6] == sign) gameEnd(sign);
    }
    const diagonal = (i, sign, board) => {
        if (i == 0 && board[4] == sign && board[8] == sign) gameEnd(sign);
        else if (i == 2 && board[4] == sign && board[6] == sign) gameEnd(sign);
    }
    
    const gameEnd = (sign) => {
        displayController.gameEndPopup(sign);
        return winState = true;
    }

    const clearBoardArr = () => {
        gameboard.boardArr = [[],[],[],[],[],[],[],[],[]];
    }

    const restartGame = () => {
        clearBoardArr();
        winState = false;
        displayController.updateDisplay(gameboard.boardArr);
        displayController.restartGameDisplay();
        currentTurn = 'x';
        playerTurn();
    }

    return {switchTurn, gameMode, mark, winCheck, restartGame, tieCheck, currentTurn, getCurrentTurn}
})();




const displayController = (() => {
    const updateDisplay = (arr) => {
        for (let i = 0; i < arr.length; i++) {
            let space = document.querySelector('#s' + i);
            space.innerHTML = arr[i];
        }
    }

    const tie = () => {
        let tieEnd = document.querySelector('#tieEndContainer');
        setTimeout(function(){ tieEnd.style.visibility = "visible"; }, 300);
    }

    const gameEndPopup = (winner) => {
        let gameEnd = document.querySelector('#gameEndContainer');
        const gameEndTitle = document.querySelector('#gameEndTitle');
        setTimeout(function(){ 
            gameEndTitle.innerHTML = "PLAYER " + winner.toUpperCase() + " WINS";
            gameEnd.style.visibility = "visible"
        }, 300);
    }
    
    const restartGameDisplay = () => {
        let tieEnd = document.querySelector('#tieEndContainer');
        let gameEnd = document.querySelector('#gameEndContainer');
        gameEnd.style.visibility = "hidden";
        tieEnd.style.visibility = "hidden";
    }

    return {updateDisplay, gameEndPopup, restartGameDisplay, tie}
})();


const playerTurn = () => {
    let currentTurn = gameController.getCurrentTurn();
    playerXDiv = document.querySelector('#playerX');
    playerODiv = document.querySelector('#playerO');
    if (currentTurn == "x") {
        playerXDiv.classList.add('active');
        playerODiv.classList.remove('active');
    } else if (currentTurn == "o"){
        playerXDiv.classList.remove('active');
        playerODiv.classList.toggle('active');
    }
};
playerTurn();


const markClick = (() => {
    document.addEventListener('click', (e) => {
        if (e.target.classList == 'space' && e.target.innerHTML.length == 0) {
            let index = e.target.id[1];
            gameController.mark(index);
        }
        gameController.winCheck();
        gameController.tieCheck();
    })
})();


const restartClick = (() => {
    const refreshButton = document.querySelector('#gameRefreshButton');
    refreshButton.addEventListener('click', () => {
        gameController.restartGame();
    })
    const tieRefreshButton = document.querySelector('#tieRefreshButton');
    tieRefreshButton.addEventListener('click', () => {
        gameController.restartGame();
    })
})();




const computer = (() => {
    let testBoard = [];
    let winState = false;
    let tieState = false;
    let testSign = ''

    const bestMove = () => {
        let bestScore = -Infinity;
        let move;
        testBoard = gameboard.boardArr;
        for (let i = 0; i < 9; i++) {
            if (testBoard[i] == '') {
                testBoard[i] = 'o';
                let score = minimax(testBoard, 0, false);
                testBoard[i] = '';
                if (score > bestScore) {
                    bestScore = score;
                    move = i;
                }
            }
        }
        gameboard.boardArr[move] = 'o';
        displayController.updateDisplay(gameboard.boardArr)
        gameController.switchTurn();
    }

    let scores = {
        "x": -1,
        'o': 1,
        'tie': 0
    };

    function minimax(testBoard, depth, maximizing) {
        let result = testResult(testBoard); 
        if (result !== null) {
            winState = false;
            tieState = false;         
            return scores[result];
        }

        if (maximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < 9; i++) {
                if (testBoard[i] == '') {
                    testBoard[i] = 'o';
                    let score = minimax(testBoard, depth + 1, false);
                    testBoard[i] = '';
                    bestScore = Math.max(score, bestScore);
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < 9; i++){
                if (testBoard[i] == '') {
                    testBoard[i] = 'x';
                    let score = minimax(testBoard, depth + 1, true);
                    testBoard[i] = '';
                    bestScore = Math.min(score, bestScore);
                }
            }
            return bestScore;
        }
    }


    const testResult = (testBoard) => {
        winCheck(testBoard);
        tieCheck(testBoard);
        if (winState == true) {
            return testSign;
        } else if (tieState == true) {
            return "tie";
        } else {
            return null;
        }
    }

    const tieCheck = (testBoard) => {
        let b = testBoard;
        if (b[0].length > 0 && b[1].length > 0 && b[2].length > 0 && b[3].length > 0 && b[4].length > 0 && b[5].length > 0 && b[6].length > 0 && b[7].length > 0 && b[8].length > 0 && winState == false) {
            tieState = true;
        }
    }

    const winCheck = (board) => {
        if (board[0].length > 0) {
            diagonal(0, board[0], board);
            horizontal(0, board[0], board);
            vertical(0, board[0], board);
        } 
        if (board[2].length > 0) {
            diagonal(2, board[2], board);
        } 
        for (let i = 1; i <= 2; i++) {
            if (board[i].length > 0) {
                vertical(i, board[i], board)
            }
        }
        for (let i = 3; i <= 6; i += 3) {
            if (board[i].length > 0) {
                horizontal(i, board[i], board)
            } 
        }
    }


    const horizontal = (index, sign, board) => {
        if (board[index+1] == sign && board[index+2] == sign) {
            winState = true;
            testSign = sign
        }
    }
    const vertical = (index, sign, board) => {
        if (board[index+3] == sign && board[index+6] == sign) {
            winState = true;
            testSign = sign
        }
    }
    const diagonal = (index, sign, board) => {
        if (index == 0 && board[4] == sign && board[8] == sign) {
            winState = true;
            testSign = sign
        } else if (index == 2 && board[4] == sign && board[6] == sign) {
            winState = true;
            testSign = sign
        }
    }

    return {bestMove}
})();