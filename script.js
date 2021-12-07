let boardArr = [[],[],[],[],[],[],[],[],[]];

const game = (() => {
    let winState = false;
    let gameMode = "computer";
    let currentTurn = 'x';

    const getCurrentTurn = () => currentTurn;

    const switchTurn = () => {
        if (currentTurn == 'x') currentTurn = 'o';
        else currentTurn = 'x';
        playerTurn();
    }

    const mark = (index) => {
        boardArr[index] = currentTurn;
        display.update(boardArr);
        switchTurn();
        if (gameMode == "computer" && currentTurn == "o") computer.bestMove();  
    }

    const tieCheck = () => {
        let a = boardArr.every(i => i.length > 0 && winState == false);
        if (a) display.tie();
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
            if (board[i].length > 0 ) {
                vertical(i, board[i], board);
            }
        }
        for (let i = 3; i <= 6; i += 3) {
            if (board[i].length > 0) {
                horizontal(i, board[i], board);
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
        display.gameEndPopup(sign);
        return winState = true;
    }

    const clearBoardArr = () => boardArr = [[],[],[],[],[],[],[],[],[]];
    
    const restart = () => {
        clearBoardArr();
        winState = false;
        display.update(boardArr);
        display.restart();
        currentTurn = 'x';
        playerTurn();
    }

    return {switchTurn, mark, winCheck, restart, tieCheck, getCurrentTurn}
})();




const display = (() => {
    const update = (arr) => {
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
    
    const restart = () => {
        let tieEnd = document.querySelector('#tieEndContainer');
        let gameEnd = document.querySelector('#gameEndContainer');
        gameEnd.style.visibility = "hidden";
        tieEnd.style.visibility = "hidden";
    }

    return {update, gameEndPopup, restart, tie}
})();


const playerTurn = () => {
    let currentTurn = game.getCurrentTurn();
    const playerXDiv = document.querySelector('#playerX');
    const playerODiv = document.querySelector('#playerO');
    if (currentTurn == "x") {
        playerXDiv.classList.add('active');
        playerODiv.classList.remove('active');
    } else if (currentTurn == "o"){
        playerXDiv.classList.remove('active');
        playerODiv.classList.toggle('active');
    }
};
playerTurn();


document.addEventListener('click', (e) => {
    if (e.target.classList == 'space' && e.target.innerHTML.length == 0) {
        game.mark(e.target.id[1]);
    }
    game.winCheck(boardArr);
    game.tieCheck();
})


const restartClick = (() => {
    const refresh = document.querySelector('#gameRefreshButton');
    const tieRefresh = document.querySelector('#tieRefreshButton');

    refresh.addEventListener('click', () => game.restart())
    tieRefresh.addEventListener('click', () => game.restart());
})();



const computer = (() => {
    let testBoard = [];
    let winState = false;
    let tieState = false;
    let testSign = ''

    let scores = {"x": -1, 'o': 1,'tie': 0};

    const bestMove = () => {
        let bestScore = -Infinity;
        let move;
        testBoard = boardArr;
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
        boardArr[move] = 'o';
        display.update(boardArr)
        game.switchTurn();
    }

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
        
        if (winState == true) return testSign;
        else if (tieState == true) return "tie";
        else return null;
    }

    const tieCheck = (testBoard) => {
        let a = testBoard.every(i => i.length > 0);
        if (a && winState == false) tieState = true;
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

    const horizontal = (i, sign, board) => {
        if (board[i+1] == sign && board[i+2] == sign) {
            winState = true;
            testSign = sign
        }
    }
    const vertical = (i, sign, board) => {
        if (board[i+3] == sign && board[i+6] == sign) {
            winState = true;
            testSign = sign
        }
    }
    const diagonal = (i, sign, board) => {
        if (i == 0 && board[4] == sign && board[8] == sign) {
            winState = true;
            testSign = sign
        } else if (i == 2 && board[4] == sign && board[6] == sign) {
            winState = true;
            testSign = sign
        }
    }
    return {bestMove}
})();