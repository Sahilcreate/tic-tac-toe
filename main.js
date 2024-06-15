/*
    Cache DOM elements to interact with the UI
*/
function domCache () {
    const uiCells = document.querySelectorAll('.js-cell');
    const uiCellsArray = [...uiCells];

    const turnTextContainer = document.querySelector('.js-turn-text-container');

    const nameCollector = document.getElementById('js-name-collector');
    const startGameForm = document.getElementById('js-start-game');

    const gameEndScreen = document.getElementById('js-game-end');
    const gameEndText = document.getElementById('js-game-end-text');

    const restartGame = document.getElementById('js-restart-game');
    const restartPage = document.getElementById('js-restart-page');

    return {
        uiCellsArray,
        turnTextContainer,
        nameCollector,
        startGameForm,
        gameEndScreen,
        gameEndText,
        restartGame,
        restartPage
    };
}



/*
    A Cell represent one square on the board and can hold the token's value in a private variable
*/
function cell(elements) {
    let value = "";

    //Add token in private variable and change class of corresponding UI cell
    const addToken = function (index, playerToken) {
        value = playerToken;
        elements.uiCellsArray[index].classList.replace('unfilled-cell', 'filled-cell');
    };

    const getValue = function() {
        return value;
    }

    return {
        addToken, 
        getValue
    };
}

/*
    The Gameboard represents the state of the board and manage cells
*/
function gameBoard(elements) {
    const totalIndeces = 9;
    let board = [];

    const initializeBoard = function() {
        for (let i = 0; i < totalIndeces; i++) {
            board.push(cell(elements));
        }
    };

    initializeBoard();

    const printBoard = function() {
        const boardWithValues = board.map((cell) => cell.getValue());
        //console.log(boardWithValues);

        for (let i = 0; i < totalIndeces; i++) {
            elements.uiCellsArray[i].textContent = boardWithValues[i];
            
        }
    };

    //Checks if the cell is taken or not.
    const validityCheck = function(index, playerToken) {
        if (board[index].getValue() === ""){
            board[index].addToken(index, playerToken);
            return true;
        } else {
            alert("Invalid move! Cell already taken.")
            return false;
        }
    };

    //Check if current move result in either win or tie
    const statusCheck = function() {
        let winResult = false;
        let tieResult = false;
        const winningConditions = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];

        for (let i = 0; i < winningConditions.length; i++) {
            const winCondition = winningConditions[i];
            let a = board[winCondition[0]].getValue();
            let b = board[winCondition[1]].getValue();
            let c = board[winCondition[2]].getValue();

            if (a && a === b && b === c) {
                winResult = true;
                elements.uiCellsArray[winCondition[0]].classList.add('winner-cell');
                elements.uiCellsArray[winCondition[1]].classList.add('winner-cell');
                elements.uiCellsArray[winCondition[2]].classList.add('winner-cell');
                break;
            }
        }

        if (!winResult) {
            //Check if all cells are filled after winResult is falsy
            tieResult = board.every((cell) => cell.getValue() !== "");
        }

        return {
            winResult,
            tieResult
        };
    };

    return {
        printBoard,
        validityCheck,
        statusCheck
    };
}

/*
    The gameController controls the game flow and player turn
*/
function gameController(playerOne = "Player One", playerTwo = "Player Two") {
    const elements = domCache();

    //passing elements as argument to minimize call of domCache()
    const board = gameBoard(elements);

    const players = [
        {
            name: playerOne,
            token: "X"
        },
        {
            name: playerTwo,
            token: "O"
        }
    ];

    //'X' always has first move
    let activePlayer = players[0];

    const switchActivePlayer = function() {
        if (activePlayer === players[0]) {
            activePlayer = players[1];
        } else {
            activePlayer = players[0];
        }
    };

    const printTurnText = function () {
        elements.turnTextContainer.textContent = `${getActivePlayer().name}'s turn`;
    }

    const getActivePlayer = function () {
        return activePlayer;
    }

    const getActivePlayerToken = function () {
        return getActivePlayer().token;
    }

    const printNewBoard = function () {
        board.printBoard();
        printTurnText();
    }

    const printFinalBoard = function (finalStatus) {
        board.printBoard();
        
        switch (finalStatus) {
            case "Winner":
                elements.gameEndText.textContent = `${getActivePlayer().name} (${getActivePlayer().token}) has won the game`;
                break;
            case "Tie":
                elements.gameEndText.textContent = "Game is a Tie";
                break;
        }

        //Show End-Screen dialog box
        elements.gameEndScreen.showModal();
    }

    //Handle a player's move
    const playRound = function(index) {
        const validMove = board.validityCheck(index, getActivePlayer().token);
        
        if (validMove) {
            const status = board.statusCheck();

            if (status.winResult) {
                //console.log(`${getActivePlayer().name} has won`);
                printFinalBoard("Winner");
                return;
                
            } else if (status.tieResult) {
                //console.log(`It's a tie`);
                printFinalBoard("Tie");
                return;
            }

            switchActivePlayer();
            printNewBoard();
        } 
    };

    printNewBoard();

    return {
        playRound,
        getActivePlayer,
        getActivePlayerToken
    };
}


/*
    Initialize the UI control and set up event listener
*/
document.addEventListener('DOMContentLoaded', () => {
    
    const elements = domCache();
    let game;
    let playerOne;
    let playerTwo;
    
    //Add event listener for cell interactions
    const addCellEventListeners = (item, index) => {
        const hoverEnterHandler = () => {
            if (game && item.classList.contains('unfilled-cell')) {
                item.textContent = game.getActivePlayerToken();
                item.classList.add('hovered-cell');
            }
        };

        const hoverLeaveHandler = () => {
            if (item.classList.contains('hovered-cell') && item.classList.contains('unfilled-cell')) {
                item.textContent = "";
                item.classList.remove('hovered-cell');
            }
        };

        const clickHandler = () => {
            if (game) {
                game.playRound(index);
                item.removeEventListener('mouseenter', hoverEnterHandler);
                item.removeEventListener('mouseleave', hoverLeaveHandler);
            }
        };

        //I tried everything (in my arsenal) but only this worked for me not add 
        //an extra event listener to cells after every restart
        if(!item.classList.contains('restarted-cell')) {
            item.addEventListener('click', clickHandler);
        } 
        item.addEventListener('mouseenter', hoverEnterHandler);
        item.addEventListener('mouseleave', hoverLeaveHandler); 
    }

    //launch game after submitting name and add events and class to ".cell"s
    elements.startGameForm.addEventListener('submit', (event) => {
        playerOne = document.getElementById('player1').value;
        playerTwo = document.getElementById('player2').value;
        game = gameController(playerOne, playerTwo);

        elements.nameCollector.close();

        elements.uiCellsArray.forEach(addCellEventListeners);
        elements.uiCellsArray.forEach((item) => {
            item.classList.add('unfilled-cell');
        })
    });

    //handle event-listeners and class assignment after every restart
    elements.restartGame.addEventListener('click', () => {            
        elements.gameEndScreen.close();

        elements.uiCellsArray.forEach((item, index) => { 
            item.classList.remove('hovered-cell', 'filled-cell', 'winner-cell');
            item.classList.add('restarted-cell', 'unfilled-cell');
            addCellEventListeners(item, index);
        })
 
        game = gameController(playerOne, playerTwo);
    });

    //'No?' will reload the page
    elements.restartPage.addEventListener('click', () => {
        location.reload();
    });
        
    //Show the Dialog Box for asking name
    elements.nameCollector.showModal();
});

