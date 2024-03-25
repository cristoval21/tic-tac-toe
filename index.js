function Cell() {
  let value = 0;

  function getValue() {
    return value;
  }

  function markSpot(player) {
    value = player;
  }

  return {
    getValue,
    markSpot
  }
}

function Gameboard() {
  const board = [];
  const boardSize = 3;

  for (let i = 0; i < boardSize; i++) {
    board[i] = [];
    for (let j = 0; j < boardSize; j++) {
      board[i].push(Cell());
    }
  }

  function getBoard() {
    return board;
  }

  function placeMark(row, column, player) {
    const currentSpot = board[row][column];
    if (currentSpot.getValue() != 0) {
      return false;
    } else {
      currentSpot.markSpot(player);
      return true;
    }
  }

  function printBoard() {
    const boardWithValues = board.map(row => row.map(cell => cell.getValue()));
    
    console.log(boardWithValues);
  }

  return {
    getBoard,
    placeMark,
    printBoard
  }
}

function Player(playerName, playerSymbol) {
  const name = playerName;
  const symbol = playerSymbol;
  
  const getName = () => name;
  const getSymbol = () => symbol;

  return {
    getName,
    getSymbol
  }
}

function GameController(
  firstPlayerName = "First Player",
  secondPlayerName = "Second Player"
) {
  const board = Gameboard();
  const firstPlayer = Player(firstPlayerName, "X");
  const secondPlayer = Player(secondPlayerName, "O");

  let currentPlayer = firstPlayer;

  function changePlayer() {
    currentPlayer = currentPlayer === firstPlayer ? secondPlayer : firstPlayer;
  }

  function playTurn(row, column) {
    const place = board.placeMark(row, column, currentPlayer.getSymbol());

    board.printBoard();

    if (!place) {
      console.log("Can't place mark there. It's already filled");
      return;
    } else {
      console.log(`Successfully marked cell on row ${row} and column ${column}`);
    }

    changePlayer();
  }

  board.printBoard();

  return {
    playTurn
  }
}

const game = GameController();