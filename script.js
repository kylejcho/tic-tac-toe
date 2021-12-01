const gameboard = (() => {
    let gameboardArr = [[['x'],['x'],['x']],
                        [['x'],['o'],['x']],
                        [['x'],['o'],['x']]];
    return gameboardArr;
})();



const Player = (name) => {
    let turnsLeft = 3;
    let marked = [];

    return {turnsLeft, marked}
}

const gameController = ((gameboardArr) => {
    const displayBoard = (gameboardArr) => {
        gameboardArr.forEach(arr => {
            arr.forEach(item => {
                
            })
        }) 
    }
    const choosePlayer = () => {}

})();