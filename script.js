const gameboard = (() => {
    let boardArr = [[],[],[],[],[],[],[],[],[]];

    return {boardArr};
})();

const Player = (sign) => {
    this.sign = sign;
    return {sign}
}

const gameController = (() => {

    let gameMode = "computer";

    winState = false;
    tieState = false;

    let currentTurn = 'x';
    console.log("currentTurn = " +currentTurn)

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
        
        computer.play(currentTurn)
    
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
        
        for (let i = 1; i < 3; i++) {
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

    const tieCheck = () => {
        let b = gameboard.boardArr;
        let gameEnd = document.querySelector('#gameEndContainer');
        if (b[0].length > 0 && b[1].length > 0 && b[2].length > 0 && b[3].length > 0 && b[4].length > 0 && b[5].length > 0 && b[6].length > 0 && b[7].length > 0 && b[8].length > 0 && winState == false) {
            displayController.tie();
            tieState = true;
        }
    }



    const horizontal = (index, sign, board) => {
        if (board[index+1] == sign && board[index+2] == sign) {
            gameEnd(sign);
        }
    }
    const vertical = (index, sign, board) => {
        if (board[index+3] == sign && board[index+6] == sign) {
            gameEnd(sign);
        }
    }
    const diagonal = (index, sign, board) => {
        if (index == 0 && board[4] == sign && board[8] == sign) {
            gameEnd(sign);
        } 
        else if (index == 2 && board[4] == sign && board[6] == sign) {
            gameEnd(sign);
        }
    }

    
    const gameEnd = (sign) => {
        let winner = sign;
        displayController.gameEndPopup(winner);
        winState = true;
    }


    const endResult = (sign) => {
        if (winState == true) {
            return sign;
        } else if (tieState == true) {
            return "tie";
        } 
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

    return {endResult, switchTurn, gameMode, mark, winCheck, restartGame, tieCheck, currentTurn, getCurrentTurn}
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
    
    const play = (currentTurn) => {
        let a = gameboard.boardArr.every(index => index[0] == 'x' || index[0] =='o' )
        if (a == false && currentTurn == "o") {
            bestMove(currentTurn);
        }
    }

    const bestMove = (currentTurn) => {
        let bestScore = -Infinity;
        let move;
        for (let i = 0; i < 9; i++) {
            if (gameboard.boardArr[i] == '') {
                console.log('Testing scenario: boardArr[' + i + ']');
                console.log(gameboard.boardArr)
                gameboard.boardArr[i] = gameController.currentTurn;
                console.log(gameboard.boardArr)
                let score = minimax(gameboard.boardArr, 0, false);
                gameboard.boardArr[i] = '';

                if (score > bestScore) {
                    bestScore = score;
                    move = i;
                }
            }
        }
        gameboard.boardArr[move] = currentTurn;
        displayController.updateDisplay(gameboard.boardArr)
        gameController.switchTurn();
    }


    let scores = {
        "x": 1,
        'o': -1,
        'tie': 0
    }

    function minimax(boardArr, depth, isMaximizing) {
        let result = gameController.endResult(gameController.currentTurn); 
        console.log('projected result ' + result);
        if (result !== undefined) {
            console.log('score = ' + scores[result])
            return scores[result];
        }

        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < 9; i++){
                if (boardArr[i] == '') {
                    console.log("testing = arr[" + i + "]")
                    boardArr[i] = 'o';
                    let score = minimax(boardArr, depth + 1, false);
                    boardArr[i] = '';
                    bestScore = Math.max(score, bestScore);
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < 9; i++){
                if (boardArr[i] == '') {
                    boardArr[i] = 'x';
                    let score = minimax(boardArr, depth + 1, true);
                    boardArr[i] = '';
                    bestScore = Math.min(score, bestScore);
                }
            }
            return bestScore;
        }

    }







    return {bestMove, play}
})();


