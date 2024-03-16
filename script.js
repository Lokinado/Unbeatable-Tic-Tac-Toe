let board = ['', '', '', '', '', '', '', '', ''];
let turn = true;
let isGameOver = false;
let mode = document.getElementById("checkbox").checked ? "m" : "s";

function updateMode(){
    let isChecked = document.getElementById("checkbox").checked;
    mode = (isChecked ? "m" : "s");
    resetGame();
}

function resetGame(){
    board = ['', '', '', '', '', '', '', '', ''];
    turn = true;
    isGameOver = false;
    document.getElementById("endgame").innerText = "";
    render(board);
}

function render(board){
    let index = 0;
    document.getElementById("board").childNodes.forEach((node) => {
        if(node.nodeName === "DIV"){
            node.innerText = board[index];
            index += 1;
        }
    })
}

function init(){
    for(let i = 0 ; i < 9 ; i++){
        document.getElementById(i.toString()).addEventListener('click',makeMove);
    }
}

function makeMove(element){
    if(isGameOver) return;
    if( element === undefined ) return;
    let index = parseInt(element.target.id);
    if( board[index].length !== 0 ) return;

    board[index] = (turn ? 'O' : 'X')
    handleGameOver(board)
    render(board)
    
    if(!isGameOver){
        turn ^= 1
        runAI()    
    }
}

function checkIsGameOver(board){
    winning_patterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ]
    let result = 0;
    for(let pattern of winning_patterns){
        let concat = board[pattern[0]] + board[pattern[1]] + board[pattern[2]];
        if( concat.length === 3){
            result |= (board[pattern[0]] === board[pattern[1]]) && (board[pattern[1]] === board[pattern[2]]);
        }
    }
    return result;
}

function handleGameOver(board){
    if( checkIsGameOver(board) ){
        isGameOver = true;
        document.getElementById("endgame").innerText = "Game won by " + (turn ? "Circle" : "Cross")
    } else if (!board.reduce((acc, value)=> acc + !value+0, 0)){
        document.getElementById("endgame").innerText = "Draw!"
    }
}

function runAI(){
    if( mode === 'm' ) return;
    let result = minimax(board,0);
    board[result[1]] = 'X';
    handleGameOver(board)
    render(board)
    turn ^= 1
}

function getScore(depth){
    return (depth % 2 === 0) ? 10-depth : depth-10;
}

function minimax(board, depth, last_move){
    let scores = [];
    board.forEach((tile,index) => {
        if(tile.length === 0){
            let new_board = structuredClone(board);
            new_board[index] = ((depth % 2 === 0) ? 'X' : 'O');
            if( checkIsGameOver(new_board) ){
                scores.push([getScore(depth), index])
            } else {
                let subcase_result = minimax(new_board, depth+1, index);
                scores.push([subcase_result[0], index])
            }
        }
    })

    if(scores.length === 0){
        scores.push([0,last_move])
    }

    let result = scores[0];
    if(depth % 2 === 0){
        result = scores.reduce((acc, score)=>{
            if(score[0] > acc[0]){
                return score;
            }
            return acc;
        }, result)
    } else {
        result = scores.reduce((acc, score)=>{
            if(score[0] < acc[0]){
                return score;
            }
            return acc;
        }, result)
    }

    return result;
}

render(board);
init()