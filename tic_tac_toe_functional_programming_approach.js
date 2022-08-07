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
let movePrompt = (currentPlayer) => `Player ${currentPlayer}, please enter the index of your next move: `;
let winMessage = (winner) => `\nPlayer ${winner} has won the game.`;


const winningTrios = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], 
    [0, 3, 6], [1, 4, 7], [2, 5, 8], 
    [0, 4, 8], [2, 4, 6]
];

let playerOnesTurn = true;
let board = new Array(boardLength ** 2).fill(empty);
let winner = null;

// Prints the current board out to the terminal.
    
//     Parameters:
//         board: A list containing the values for each position on the board.
//         padding: How many spaces should appear either side of the values.
function printGameboard (board, padding = 1) {
    const horizontal_divider = '-'.repeat(boardLength * (2 * padding + 1) + 2);
    console.log("\n");

    //Divide the array into rows based on the board length
    for (let rowIndex = 0; rowIndex < boardLength; ++rowIndex) {
        if (rowIndex != 0) {
            console.log(horizontal_divider);
        }
        let start = rowIndex * boardLength;
        let row = board.slice(start, start + boardLength);
        row = row.map(item => `${empty.repeat(padding)}${item}${empty.repeat(padding)}`).join("|");

        console.log(row);
    }
    console.log("\n");
}

function reset() {
    playerOnesTurn = true;
    board = new Array(boardLength ** 2).fill(empty);
    winner = null;
}

function getNextMove() {
    while (true) {
       let move = prompt( movePrompt( getCurrentPlayer() ) );

        //Type check the input value.
       if (typeof Number(move) === 'number') {
        return Number(move);
       }

       console.log(invalidInput);
    }
}

function getCurrentPlayer() {
    return (playerOnesTurn ? playerOne : playerTwo);
}


//Check if the current player has won the game.
function check_win() {

    //Get all of the indices of current_player's moves.
    let positions = board.map((value, index) => {return {value, index}})
    .filter(entries => entries.value == getCurrentPlayer())
    .map(entries => entries.index);


    // Check if the player is at all indicies in a winning trio
    if (winningTrios.some(trio => trio.every(item => positions.includes(item)))) {
        return true;
    }
    
    return false;
}

//Returns true iff neither player is able to make a move.
function hasDrawn() {
    return !(board.includes(empty));
}

function isOver() {
    return (hasDrawn() || winner != null);
}

function display_winner_info() {
    if (winner === null) {
        printGameboard(board);
        console.log(drawMessage);
    } else {
        printGameboard(board);
        console.log(winMessage(winner));
    }
}

function play() {
    while (!isOver()) {
        printGameboard(board);

        let index = getNextMove();

         // Perform out of bounds checks
         if (!(0 <= index < boardLength ** 2)) {
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
        board[index] = getCurrentPlayer();

        // Check for end game conditions
        if (check_win()) {
            winner = getCurrentPlayer();
            return;
        }

        // Flip the turn
        playerOnesTurn = !playerOnesTurn;
    }
}


function main(){
    while (true) {
        play();
        display_winner_info();
        // Ask user if they want to play again
        if (prompt(replayPrompt) != 'y') {
        break;
        }

        reset();
    }
}

main();