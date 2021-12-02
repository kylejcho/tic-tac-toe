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
    
    const winScenarios = () => {
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
            win();
        }
    }
    const vertical = (index, sign, board) => {
        if (board[index+3] == sign && board[index+6] == sign) {
            win();
        }
    }
    const diagonal = (index, sign, board) => {
        if (index == 0 && board[4] == sign && board[8] == sign) {
            win();
        } 
        else if (index == 2 && board[4] == sign && board[6] == sign) {
            win();
        }
    }
    
    const win = () => {
        setTimeout(function(){ alert("You Win"); }, 10);
    }

    return {mark, winScenarios}
})();

const displayController = (() => {
    const updateDisplay = (arr) => {
        for (let i = 0; i < arr.length; i++) {
            let space = document.querySelector('#s' + i);
            space.innerHTML = arr[i];
        }
    }
    return {updateDisplay}
})();


const markClick = (() => {
    document.addEventListener('click', (e) => {
        if (e.target.classList == 'space' && e.target.innerHTML.length == 0) {
            let index = e.target.id[1];
            gameController.mark(index);
        }
        gameController.winScenarios();
    })
})();

//setTimeout(function(){ alert("You Win"); }, 10);