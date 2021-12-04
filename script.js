const gameboard = (() => {
    let boardArr = [[],[],[],[],[],[],[],[],[]];

    const clearBoardArr = () => {
        boardArr = [[],[],[],[],[],[],[],[],[]];
    }

    return {boardArr, clearBoardArr};
})();

const Player = (sign) => {
    this.sign = sign;
    return {sign}
}

const gameController = (() => {
    const playerX = Player('x');
    const playerO = Player('o');

    let currentTurn = 'x';
    
    const switchTurn = () => {
        if (currentTurn == 'x') currentTurn = 'o'
        else currentTurn = 'x'
    }

    const mark = (index) => {
        gameboard.boardArr[index] = currentTurn;
        displayController.updateDisplay(gameboard.boardArr)
        switchTurn();
    }
    
    const winCheck = () => {
        let board = gameboard.boardArr;
        for (let i = 0; i < board.length; i ++) {
            winScenarios(i, board[i], board);
        }
    }

    const winScenarios = (index, sign, board) => {
        //horizontal
            if (board[index+1] == sign && board[index+2] == sign) {
                gameEnd();
            }
        //vertical
            if (board[index+3] == sign && board[index+6] == sign) {
                gameEnd();
            }
        //diagonal
            if (index == 0 && board[4] == sign && board[8] == sign) {
                gameEnd();
            } else if (index == 2 && board[4] == sign && board[6] == sign) {
                gameEnd();
            }
    }

    
    const gameEnd = () => {
        displayController.gameEndPopup();
    }

    const restartGame = () => {
        gameboard.clearBoardArr();
        displayController.updateDisplay(gameboard.boardArr)
    }

    return {mark, winScenarios, winCheck, restartGame}
})();

const displayController = (() => {
    const updateDisplay = (arr) => {
        for (let i = 0; i < arr.length; i++) {
            let space = document.querySelector('#s' + i);
            space.innerHTML = arr[i];
        }
    }
 
    const gameEndPopup = () => {
        let gameEnd = document.querySelector('#gameEndContainer');
        gameEnd.style.visibility = "visible"
    }
    
    return {updateDisplay, gameEndPopup}
})();


const markClick = (() => {
    document.addEventListener('click', (e) => {
        if (e.target.classList == 'space' && e.target.innerHTML.length == 0) {
            let index = e.target.id[1];
            gameController.mark(index);
        }
        gameController.winCheck();
    })
})();


const restartClick = (() => {
    const refreshButton = document.querySelector('#gameRefreshButton');
    refreshButton.addEventListener('click', () => {
        gameController.restartGame();
    })
})();

