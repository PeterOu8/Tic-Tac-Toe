const prompt = require("prompt-sync")({sigint: true});
const BOARD_LENGTH = 3;
const PLAYER_ONE = 'X';
const PLAYER_TWO = 'O';
const EMPTY = ' ';

//Messages

const INVALID_INPUT = 'Wrong input. Please try again';
const OUT_OF_BOUNDS = 'Position out of bounds. Please try again.';
const POSITION_FILLED = 'Position already filled. Please try again.';
const DRAW_MESSAGE = 'The game ended in a draw.';
const REPLAY_PROMPT = 'Do you wish to play again? [y/N] ';

const WINNING_TRIOS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], 
    [0, 3, 6], [1, 4, 7], [2, 5, 8], 
    [0, 4, 8], [2, 4, 6]
];

// Prints the current board out to the terminal.
    
//     Parameters:
//         board: A list containing the values for each position on the board.
//         padding: How many spaces should appear either side of the values.
function print_game_board (board, padding = 1) {
    const horizontal_divider = '-'.repeat(BOARD_LENGTH * (2 * padding + 1) + 2);
    console.log("\n");

    //Divide the array into rows based on the board length
    for (let row_index = 0; row_index < BOARD_LENGTH; ++row_index) {
        if (row_index != 0) {
            console.log(horizontal_divider);
        }
        let start = row_index * BOARD_LENGTH;
        let row = board.slice(start, start + BOARD_LENGTH);
        row = row.map(item => `${EMPTY.repeat(padding)}${item}${EMPTY.repeat(padding)}`);

        console.log(row.join("|"));
    }
    console.log("\n");
}

let player_ones_turn = true;
let board = new Array(BOARD_LENGTH ** 2).fill(EMPTY);
let winner = null;

function reset() {
    player_ones_turn = true;
    board = new Array(BOARD_LENGTH ** 2).fill(EMPTY);
    winner = null;
}

function get_next_move() {
    while (true) {
       let move = prompt(`Player ${get_current_player()}, please enter the index of your next move: `);

        //Type check the input value. Only the cheat code can by pass this
       if (typeof Number(move) === 'number') {
        return Number(move);
       }

       console.log(INVALID_INPUT);
    }
}

function get_current_player() {
    return (player_ones_turn ? PLAYER_ONE : PLAYER_TWO);
}


//Check if the current player has won the game.
function check_win() {

    //Get all of the indices of current_player's moves.
    let positions = board.map((value, index) => {return {value, index}})
    .filter(entries => entries.value == get_current_player())
    .map(entries => entries.index);


    // Check if the player is at all indicies in a winning trio
    if (WINNING_TRIOS.some(trio => trio.every(item => positions.includes(item)))) {
        return true;
    }
    
    return false;
}

//Returns true iff neither player is able to make a move.
function has_drawn() {
    return !(board.includes(EMPTY));
}

function is_over() {
    return (has_drawn() || winner != null);
}

function display_winner_info() {
    if (winner === null) {
        print_game_board(board);
        console.log(DRAW_MESSAGE);
    } else {
        print_game_board(board);
        console.log(`\nPlayer ${winner} has won the game!!`)
    }
}

function play() {
    while (!is_over()) {
        print_game_board(board);

        let index = get_next_move();

         // Perform out of bounds checks
         if (!(0 <= index < BOARD_LENGTH ** 2)) {
            console.log(OUT_OF_BOUNDS);
            continue;
        }

        // Check if position already filled
        if (board[index] != EMPTY) {
            console.log(board);
            console.log(POSITION_FILLED);
            continue;
        }

        // Enact the move on the board
        board[index] = get_current_player();

        // Check for end game conditions
        if (check_win()) {
            winner = get_current_player();
            return;
        }

        // Flip the turn
        player_ones_turn = !player_ones_turn;
    }
}


function main(){
    while (true) {
        play();
        display_winner_info();
        // Ask user if they want to play again
        if (prompt(REPLAY_PROMPT) != 'y') {
        break;
        }

        reset();
    }
}

main();