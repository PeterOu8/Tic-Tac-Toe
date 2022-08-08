const prompt = require("prompt-sync")({sigint: true});
const boardLength = 3;
const playerOne = 'X';
const playerTwo = 'O';
const empty = ' ';

//Messages

const invalidInput = 'Wrong input. Please try again';
const outOfBounds = 'Position out of bounds. Please try again.';
const positionFilled = 'Position already filled. Please try again.';
const drawMessage = 'The game ended in a draw.';
const replayPrompt = 'Do you wish to play again? [y/N] ';

const winningTrios = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], 
    [0, 3, 6], [1, 4, 7], [2, 5, 8], 
    [0, 4, 8], [2, 4, 6]
];

// Prints the current board out to the terminal.
    
//     Parameters:
//         board: A list containing the values for each position on the board.
//         padding: How many spaces should appear either side of the values.
function printGameBoard (board, padding = 1) {
    const horizontal_divider = '-'.repeat(boardLength * (2 * padding + 1) + 2);
    console.log("\n");

    //Divide the array into rows based on the board length
    for (let i = 0; i < boardLength; ++i) {
        if (i != 0) {
            console.log(horizontal_divider);
        }
        let start = i * boardLength;
        let row = board.slice(start, start + boardLength);
        row = row.map(item => `${empty.repeat(padding)}${item}${empty.repeat(padding)}`);

        console.log(row.join("|"));
    }
    console.log("\n");
}

function reset(playerOnesTurn, board, winner) {
    playerOnesTurn = true;
    board = new Array(boardLength ** 2).fill(empty);
    winner = null;
}

function getNextMove(playerOnesTurn) {
    let movePrompt = (currentPlayer) => `Player ${currentPlayer}, please enter the index of your next move: `;
    while (true) {
       let move = prompt( movePrompt( getCurrentPlayer(playerOnesTurn) ) );

        //Type check the input value.
       if (typeof Number(move) === 'number') {
        return Number(move);
       } 
       console.log(invalidInput);
    }
}

function getCurrentPlayer(playerOnesTurn) {
    return (playerOnesTurn ? playerOne : playerTwo);
}

function getLoser(playerOnesTurn) {
    return (playerOnesTurn ? playerTwo : playerOne);
}

//Check if the current player has won the game.
function checkWin(board, playerOnesTurn) {

    //Get all of the indices of current_player's moves.
    let positions = board.map((value, index) => {return {value, index}})
    .filter(entries => entries.value == getCurrentPlayer(playerOnesTurn))
    .map(entries => entries.index);

    // Check if the player is at all indicies in a winning trio
    if (winningTrios.some(trio => trio.every(item => positions.includes(item)))) {
        return true;
    }
    return false;
}

function hasDrawn(board) {
    return !(board.includes(empty));
}

function isOver(board, winner) {
    return (hasDrawn(board) || winner != null);
}

function play(board, winner, playerOnesTurn) {

    while ( !isOver(board, winner) ) {
        printGameBoard(board);

        let index = getNextMove(playerOnesTurn);

        // Perform out of bounds checks
        if ( !(0 <= index < boardLength ** 2) ) {
            console.log(outOfBounds);
            continue;
        }

        // Check if position already filled
        if (board[index] != empty) {
            console.log(board);
            console.log(positionFilled);
            continue;
        }

        // Enact the move on the board
        board[index] = getCurrentPlayer(playerOnesTurn);

        // Check for end game conditions
        if ( checkWin(board, playerOnesTurn) ) {
            winner = getCurrentPlayer(playerOnesTurn);   
            return winner;
        } else if ( hasDrawn(board) ) {
            return null;
        }

        // Flip the turn
        playerOnesTurn = !playerOnesTurn;
    }
}

function displayWinnerInfo(winner, playerOnesTurn, board) {
    let winMessage = (winner) => `\nPlayer ${winner} has won the game.\n\n`;
    let loseMessage = (player) => `\nAnd player ${player} is the\n\n`
    + `██       ██████  ███████ ███████ ██████  \n` + `██      ██    ██ ██      ██      ██   ██ \n` + `██      ██    ██ ███████ █████   ██████  \n`
    + `██      ██    ██      ██ ██      ██   ██ \n` + `███████  ██████  ███████ ███████ ██   ██ \n`;
    if (winner === null) {
        printGameBoard(board);
        console.log(drawMessage);
    } else {
        console.clear();
        printGameBoard(board);
        console.log( winMessage(winner) );
        console.log( loseMessage(getLoser(playerOnesTurn)) );
    }
}

    function game(board, playerOnesTurn, winner) {
        displayWinnerInfo( play(board, winner, playerOnesTurn), playerOnesTurn, board);
    }

/***************/
function main() {
    let playerOnesTurn = true;
    let board = new Array(boardLength ** 2).fill(empty);
    let winner = null;

    while (true) {
        game(board, playerOnesTurn, winner);

        // Ask user if they want to play again
        if (prompt(replayPrompt) != 'y') {
            console.clear();
            //Prints out the game over text to the console
            //Avoided the escape characteristic of backslashes by escaping the escape characters. (IKR)
            console.log("\n\n\n\n\n\n\n\n\n");
            console.log(`            _______       __       ___      ___   _______         ______  ___      ___  _______   _______   `);
            console.log(`            /" _   "|     /""\\     |"  \\    /"  | /"     "|       /    " \\|"  \\    /"  |/"     "| /"      \\  `);
            console.log(`           (: ( \\___)    /    \\     \\   \\  //   |(: ______)      // ____  \\\\   \\  //  /(: ______)|:        | `);
            console.log(`            \\/ \\        /' /\\  \\    /\\\\  \\/.    | \\/    |       /  /    ) :)\\\\  \\/. ./  \\/    |  |_____/   ) `);
            console.log(`            //  \\ ___  //  __'  \\  |: \\.        | // ___)_     (: (____/ //  \\.    //   // ___)_  //      /  `);
            console.log(`           (:   _(  _|/   /  \\\\  \\ |.  \\    /:  |(:      "|     \\        /    \\\\   /   (:      "||:  __   \\  `);
            console.log(`            \\_______)(___/    \\___)|___|\\__/|___| \\_______)      \\"_____/      \\__/     \\_______)|__|  \\___) `);
            console.log("\n\n\n\n\n\n\n\n\n");
        break;
        }
        reset(playerOnesTurn, board, winner);
    }
}

main();
