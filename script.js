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
        if (currentTurn == 'x') {
            currentTurn = 'o'
        } else {
            currentTurn = 'x'
        }
    }

    const mark = (index) => {
        gameboard.boardArr[index] = currentTurn;
        console.log(gameboard.boardArr);
        displayController.updateDisplay(gameboard.boardArr)
        switchTurn();
    }

    return {mark}
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
            console.log(index);
            gameController.mark(index);
        }
    })
})();
