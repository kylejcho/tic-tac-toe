const gameboard = (() => {
    let boardArr = [[],[],[],[],[],[],[],[],[]];

    return {boardArr};
})();

const Player = (sign) => {
    this.sign = sign;
    return {sign}
}

const gameController = (() => {
    winState = false;

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

    return {mark, winCheck, restartGame, tieCheck, currentTurn, getCurrentTurn}
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


