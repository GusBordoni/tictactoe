const boardUI = document.querySelector('#board');
const tiles = document.querySelectorAll('.board-tile');
const start = document.querySelector('button');
const statusText = document.querySelector('#result');
const actualPlayer = document.querySelector('#current-player');
const player1Name = document.querySelector('#p1');
const player2Name = document.querySelector('#p2');
const Players = [{name: 'Player 1',marker: "&#9587;"},{name: 'Player 2',marker: "&#9711;"}];
let matchStatus = ' ';

let Gameboard = (() => {
    let board = [];
    let count = 0;
    let playerTurn = 1;
    let gameActive = true;

    // playerturn
    const getPlayerTurn = () => playerTurn;
    
    // init
    const initializeBoard = () => {
        for (let i = 0; i < 3; i++) { // rows
            board[i] = [];
            for (let j = 0; j < 3; j++) { // columns
                board[i].push("");
                let index = i * 3 + j;
                tiles[index].innerHTML = '';
            }
        }
        actualPlayer.innerHTML = `Turn: ${Players[getPlayerTurn()-1].name} - ${Players[getPlayerTurn()-1].marker}`
        statusText.innerHTML = ' ';
        gameActive = true;
    }

    initializeBoard();

    // player marker
    const getPlayerMarker = () => {
        const currentPlayer = getPlayerTurn();
        return Players[currentPlayer-1].marker;
    }

    // toggle red
    const toggleRed = () => {
        for (let i = 0; i < 9; i++) {
            tiles[i].classList.toggle('red');
        }
    }

    // reset
    const reset = () => {
        board = [];
        count = 0;
        playerTurn = 1;
        gameActive = true;
        matchStatus = ' ';
        initializeBoard();
        tiles.forEach(tile => {
            tile.classList.remove('red');
            tile.classList.remove('green');
        });
        actualPlayer.innerHTML = `Turn: ${Players[Gameboard.getPlayerTurn()-1].name} - ${Players[Gameboard.getPlayerTurn()-1].marker}`
    }

    const isGameActive = () => gameActive;

    const changeTurn = () => playerTurn = playerTurn === 1 ? 2 : 1;

    const checkWin = (marker,count) => { 
        let winCondition = null;

        if (board[0][0] === marker && board[0][1] === marker && board[0][2] === marker) {
            winCondition = [[0, 0], [0, 1], [0, 2]];
        } else if (board[1][0] === marker && board[1][1] === marker && board[1][2] === marker) {
            winCondition = [[1, 0], [1, 1], [1, 2]];
        } else if (board[2][0] === marker && board[2][1] === marker && board[2][2] === marker) {
            winCondition = [[2, 0], [2, 1], [2, 2]];
        } else if (board[0][0] === marker && board[1][0] === marker && board[2][0] === marker) {
            winCondition = [[0, 0], [1, 0], [2, 0]];
        } else if (board[0][1] === marker && board[1][1] === marker && board[2][1] === marker) {
            winCondition = [[0, 1], [1, 1], [2, 1]];
        } else if (board[0][2] === marker && board[1][2] === marker && board[2][2] === marker) {
            winCondition = [[0, 2], [1, 2], [2, 2]];
        } else if (board[0][0] === marker && board[1][1] === marker && board[2][2] === marker) {
            winCondition = [[0, 0], [1, 1], [2, 2]];
        } else if (board[2][0] === marker && board[1][1] === marker && board[0][2] === marker) {
            winCondition = [[2, 0], [1, 1], [0, 2]];
        }

        if(winCondition) {
            matchStatus = `Player ${getPlayerTurn()} wins!`;
            winCondition.forEach(pos => {
                tiles[pos[0] * 3 + pos[1]].classList.add('green');
            });
            gameActive = false;
            return true;
        }
        if(count === 9) {
            matchStatus = 'Draw!';
            gameActive = false;
            toggleRed();
            return false
        }
        return null;
    }



    // move play
    const play = (move) => {
        let getPos = move.toString().padStart(2, '0').split('').map(Number);
    
        if((playerTurn === 1 || playerTurn === 2) && gameActive){
            if(board[getPos[0]][getPos[1]] === ''){
                board[getPos[0]][getPos[1]] = Players[playerTurn-1].marker;
                count++;
                checkWin(Players[playerTurn-1].marker,count);
                // Gameboard.showBoard();
                return true;
            } else {
                matchStatus = 'Nope!';
                return false;
            }
        } else {
            matchStatus = 'Error: Invalid player.';
            return false;
        }

    }

    // show board
    const showBoard = () => {
        console.table(board);
    }

    return {
        showBoard,
        reset,
        play,
        getPlayerTurn,
        getPlayerMarker,
        isGameActive,
        changeTurn
    }
})();

boardUI.addEventListener('click', (e) => {
    if(e.target.classList.contains('board-tile')) {
        let index = Array.from(tiles).indexOf(e.target) + 1;
        
        // cords
        const rowIndex = Math.floor((index-1) / 3);
        const colIndex = (index-1) % 3;
        index = (String(rowIndex)+String(colIndex)).padStart(2, '0');

        if (Gameboard.isGameActive() && Gameboard.play(index)) {
           
            e.target.innerHTML = Gameboard.getPlayerMarker();
            Gameboard.changeTurn();

            actualPlayer.innerHTML = `Turn: ${Players[Gameboard.getPlayerTurn()-1].name} - ${Players[Gameboard.getPlayerTurn()-1].marker}`;
            statusText.innerHTML = matchStatus;

        } else if (!Gameboard.isGameActive()) {
            statusText.innerHTML = 'Start a new match!';
        }
    }
});

player1Name.addEventListener('blur', (e) => {
    Players[0].name = player1Name.textContent;
    Gameboard.reset();
})

player1Name.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        player1Name.blur();
    }
});

player2Name.addEventListener('input', (e) => {
    Players[1].name = player2Name.textContent;
    Gameboard.reset();
})

player2Name.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        player2Name.blur();
    }
});

start.addEventListener('click', (e) => {
    Gameboard.reset();
});