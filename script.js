const gameboard = (() => {
    let boardArr = [[],[],[],[],[],[],[],[],[]];


    return {boardArr};
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
        
        if (board[0].length > 0) {
            diagonal(0, board[0], board);
            horizontal(0, board[0], board);
            vertical(0, board[0], board)      
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

    const horizontal = (index, sign, board) => {
        if (board[index+1] == sign && board[index+2] == sign) {
            gameEnd();
        }
    }
    const vertical = (index, sign, board) => {
        if (board[index+3] == sign && board[index+6] == sign) {
            gameEnd();
        }
    }
    const diagonal = (index, sign, board) => {
        if (index == 0 && board[4] == sign && board[8] == sign) {
            gameEnd();
        } 
        else if (index == 2 && board[4] == sign && board[6] == sign) {
            gameEnd();
        }
    }
    
    const gameEnd = () => {
        displayController.gameEndPopup();
    }

    const clearBoardArr = () => {
        gameboard.boardArr = [[],[],[],[],[],[],[],[],[]];
    }

    const restartGame = () => {
        clearBoardArr();
        displayController.updateDisplay(gameboard.boardArr);
        displayController.restartGameDisplay();
    }

    return {mark, winCheck, restartGame}
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
    
    const restartGameDisplay = () => {
        let gameEnd = document.querySelector('#gameEndContainer');
        gameEnd.style.visibility = "hidden";
    }

    return {updateDisplay, gameEndPopup, restartGameDisplay}
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

