let boardArr = [[],[],[],[],[],[],[],[],[]];

const game = (() => {
    let winState = false;
    let gameMode = "computer";
    let botDifficulty = "easy";
    let currentTurn = 'x';


    const gameModeSelection = () => {
        const selection = document.querySelector('select');
        if (selection.value == "Play against a friend") {
            gameMode = ""
            restart()
            playerTurn();
        } else if (selection.value == "Easy"){
            gameMode = "computer";
            botDifficulty = "easy";
            restart();
            playerTurn();
        } else if (selection.value == "Medium"){
            gameMode = "computer";
            botDifficulty = "medium";
            restart();
            playerTurn();
        } else if (selection.value == "Hard"){
            gameMode = "computer";
            botDifficulty = "hard";
            restart();
            playerTurn();
        } else {
            gameMode = "computer";
            botDifficulty = "impossible";
            restart();
            playerTurn();
        }
        console.log(botDifficulty)
    }

    const getGameMode = () => gameMode;

    const getCurrentTurn = () => currentTurn;

    const switchTurn = () => {
        if (currentTurn == 'x') currentTurn = 'o';
        else currentTurn = 'x';
        playerTurn();

        if (gameMode == "computer" && currentTurn == "o" && winState == false) {
            computer.difficulty(botDifficulty);
        } 
    }

    const mark = (index) => {
        audio.pop()
        boardArr[index] = currentTurn;
        display.update(boardArr);
        winCheck(boardArr);
        tieCheck();
        switchTurn();
    }

    const tieCheck = () => {
        let a = boardArr.every(i => i.length > 0);
        if (a == true && winState == false) display.tie();
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
        if (board[i+1] == sign && board[i+2] == sign) {
            document.querySelector('#unclickableDiv').style.visibility = "visible";
            display.threeRow(i, i + 1, i + 2);
            gameEnd(sign);
        }
    }
    const vertical = (i, sign, board) => {
        if (board[i+3] == sign && board[i+6] == sign) {
            document.querySelector('#unclickableDiv').style.visibility = "visible";
            display.threeRow(i, i + 3, i + 6); 
            gameEnd(sign);
        }
    }
    const diagonal = (i, sign, board) => {
        if (i == 0 && board[4] == sign && board[8] == sign) {
            document.querySelector('#unclickableDiv').style.visibility = "visible";
            display.threeRow(0, 4, 8);
            gameEnd(sign);

            
        } else if (i == 2 && board[4] == sign && board[6] == sign) {
            document.querySelector('#unclickableDiv').style.visibility = "visible";
            display.threeRow(2, 4, 6);
            gameEnd(sign);
        }
    }
    
    const gameEnd = (sign) => {
        display.gameEndPopup(sign);
        winState = true;
    }

    const clearBoardArr = () => boardArr = [[],[],[],[],[],[],[],[],[]];
    
    const restart = () => {
        clearBoardArr();
        winState = false;
        display.update(boardArr);
        display.restart();
        currentTurn = 'x';
        playerTurn();
        document.querySelector("#unclickableDiv").style.visibility = "hidden";
    }

    return {winState, gameModeSelection,getGameMode, switchTurn, mark, winCheck, restart, tieCheck, currentTurn, getCurrentTurn, gameMode}
})();




const display = (() => {
    const update = (arr) => {
        for (let i = 0; i < arr.length; i++) {
            let space = document.querySelector('#s' + i);
            space.innerHTML = arr[i];
        }
    }

    const tie = () => {
        document.querySelector('#unclickableDiv').style.visibility = "visible";
        let tieEnd = document.querySelector('#tieEndContainer');
        setTimeout(function(){ tieEnd.style.visibility = "visible"; }, 300);
    }

    const gameEndPopup = (winner) => {
        let gameEnd = document.querySelector('#gameEndContainer');
        const gameEndTitle = document.querySelector('#gameEndTitle');
        
        setTimeout(function(){ 
            if (winner == "o" && game.gameMode == "computer") {
                gameEndTitle.innerHTML = "YOU LOSE";
            } else {
                gameEndTitle.innerHTML = "PLAYER " + winner.toUpperCase() + " WINS";
            }
            gameEnd.style.visibility = "visible"
        }, 1000);
    }
    
    const restart = () => {
        threeRowClear();
        let tieEnd = document.querySelector('#tieEndContainer');
        let gameEnd = document.querySelector('#gameEndContainer');
        gameEnd.style.visibility = "hidden";
        tieEnd.style.visibility = "hidden";
    }

    const threeRow = (a, b, c) => {
        const one = document.querySelector('#s' + a + '');
        const two = document.querySelector('#s' + b + '');
        const three = document.querySelector('#s' + c + '');

        setTimeout(function(){audio.win(); }, 150);
        setTimeout(function(){one.classList.add("highlight"); }, 250);
        setTimeout(function(){two.classList.add("highlight"); }, 350);
        setTimeout(function(){three.classList.add("highlight"); }, 450);
    }

    const threeRowClear = () => {
        for (let i = 0; i < 9; i++) {
            let space = document.querySelector('#s' + i + '');
            space.classList.remove("highlight");
        }
    }

    return {update, gameEndPopup, restart, tie, threeRow}
})();


const playerTurn = () => {
    let currentTurn = game.getCurrentTurn();
    const playerXDiv = document.querySelector('#playerX');
    const playerODiv = document.querySelector('#playerO');

    if (game.getGameMode()  == "computer") {
        playerODiv.innerHTML = "COMPUTER";
    } else {
        playerODiv.innerHTML = "PLAYER O";
    }

    if (currentTurn == "x") {
        playerXDiv.classList.add('active');
        playerODiv.classList.remove('active');
    } else if (currentTurn == "o"){
        playerXDiv.classList.remove('active');
        playerODiv.classList.toggle('active');
    }
};
playerTurn();


const audio = (() => {
    const win = () => {
        const winAudio = document.querySelector('#winAudio');
        winAudio.load();
        winAudio.play()
    }
    
    const pop = () => {
        const popAudio = document.querySelector('#popAudio');
        popAudio.load();
        popAudio.play();
    }

    return {win, pop}
})();



document.addEventListener('click', (e) => {
    let tieEnd = document.querySelector('#tieEndContainer');
    let gameEnd = document.querySelector('#gameEndContainer');
    if (game.getCurrentTurn() != 'x' && game.getGameMode() == 'computer') {
        return;
    }
    if (document.querySelector('#unclickableDiv').style.visibility == "visible") {
        return;
    }
    if (e.target.classList == 'space' && e.target.innerHTML.length == 0) {
        game.mark(e.target.id[1]);
    }
    //game.winCheck(boardArr);
    //game.tieCheck();
})

const selection = document.querySelector('select');
selection.addEventListener('change', () => game.gameModeSelection());


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


    const difficulty = (difficulty) => {
        let botDifficulty
        if (difficulty == "easy") {
            return randomMove();
        } else if (difficulty == "medium") {
            botDifficulty = Math.floor(Math.random() * 2)
        } else if (difficulty == "hard") {
            botDifficulty = Math.floor(Math.random() * 3)
        } else if (difficulty == "impossible") {
            return bestMove();
        } 
        if (botDifficulty == 0 ) {
            randomMove();
        } else {
            bestMove();
        }
    }

    const randomMove = () => {
        if (document.querySelector('#unclickableDiv').style.visibility != "visible") {
            let i = Math.floor(Math.random() * 9);
            if (boardArr[i] == '') {
                boardArr[i] = 'o';
                game.winCheck(boardArr);
                game.tieCheck();
            
                setTimeout(function(){
                    if (document.querySelector('#unclickableDiv').style.visibility != "visible") {
                        audio.pop();
                    }
                    display.update(boardArr); 
                    game.switchTurn();
                }, 650);
            } else {
                randomMove();
            }
        }
        
    }

    const bestMove = () => {
        let bestScore = -Infinity;
        let move;
        testBoard = boardArr;
        for (let i = 0; i < 9; i++) {
            if (testBoard[i] == '') {
                testBoard[i] = 'o';
                game.winCheck(boardArr);
                game.tieCheck();

                let score = minimax(testBoard, 0, false);
                testBoard[i] = '';
                if (score > bestScore) {
                    bestScore = score;
                    move = i;
                }
            }
        }
        
        boardArr[move] = 'o';
        setTimeout(function(){
            if (document.querySelector('#unclickableDiv').style.visibility != "visible") {
                audio.pop();
            }
            display.update(boardArr); 
            game.switchTurn();
        }, 650);
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
    return {bestMove, difficulty}
})();