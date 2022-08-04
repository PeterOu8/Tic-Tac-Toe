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

//A class which represents a single tic-tac-toe game.
class Game {
    //The game class constructor
    constructor() {
        this.reset();
    }

    //Returns the game to a valid starting state.
    reset() {
        this.player_ones_turn = true;
        this.board = new Array(BOARD_LENGTH ** 2).fill(EMPTY);
        this.winner = null;
    }

    //Plays a tic-tac-toe game through to completion.
    play() {

        while (!this.is_over()) {
            // Print the game board after each move is prompted
            print_game_board(this.board);

            // Prompt the next player for a move
            let index = this.get_next_move();

            // Perform out of bounds checks
            if (!(0 <= index < BOARD_LENGTH ** 2)) {
                console.log(OUT_OF_BOUNDS);
                continue;
            }

            //Enable cheat when the input matches the cheat code
            if (index == "I'm about to cheat") {
                console.log(`Player ${this.get_current_player()} is just better!!`);
                this.cheat = true;
                break;
            } else {
                // Check if position already filled
                if (this.board[index] != EMPTY) {
                    console.log(POSITION_FILLED);
                    continue;
                }
            }

            // Enact the move on the board
            this.board[index] = this.get_current_player();

            // Check for end game conditions
            if (this.check_win()) {
                this.winner = this.get_current_player();
                return;
            }

            // Flip the turn
            this.player_ones_turn = !this.player_ones_turn;
        }
    }

    // Repeatedly prompts the user for their next move until they give a
    // numerical index, which it returns.
    // Doesn't perform out of bounds validity checks on the supplied index.
    get_next_move() {
        while (true) {
           let move = prompt(`Player ${this.get_current_player()}, please enter the index of your next move: `);

           //Check if the input is equal to cheat code
           //If true, the current player will win
           if (move == "I'm about to cheat") {
            this.board.fill(this.get_current_player());
            print_game_board(this.board);
            this.winner = this.get_current_player();
            return move;
            }

            //Type check the input value. Only the cheat code can by pass this
           if (typeof Number(move) === 'number') {
            return Number(move);
           }

           console.log(INVALID_INPUT);
        }
    }

    //Get the string corresponding to the player whose turn it is.
    get_current_player() {
        return (this.player_ones_turn ? PLAYER_ONE : PLAYER_TWO);
    }

    //Check if the current player has won the game.
    check_win() {

        //Get all of the indices of current_player's moves.
        let positions = this.board.map((value, index) => {return {value, index}})
        .filter(entries => entries.value == this.get_current_player())
        .map(entries => entries.index);


        // Check if the player is at all indicies in a winning trio
        if (WINNING_TRIOS.some(trio => trio.every(item => positions.includes(item)))) {
            return true;
        }
        
        return false;
    }

    //Returns true iff neither player is able to make a move.
    has_drawn() {
        return !(this.board.includes(EMPTY));
    }

    //Returns true iff the game is over.
    is_over() {
        return (this.has_drawn() || this.winner != null);
    }

    //Prints winning or drawing info after the game has completed.
    display_winner_info() {
        if (this.winner === null) {
            print_game_board(this.board);
            console.log(DRAW_MESSAGE);
        } else {
            print_game_board(this.board);
            console.log(`\nPlayer ${this.winner} has won the game!!`)
        }
    }
}


var game = new Game();
while (true) {
    game.play();
    game.display_winner_info();

    //Ask the damn loser if he is ready to lose again
    if (game.cheat && prompt("Are you ready to lose again? [y/N] ")!= 'N') {
        break;
    } else {
        // Ask user if they want to play again
        if (prompt(REPLAY_PROMPT) != 'y') {
        break;
        }
    }

    game.reset();
}