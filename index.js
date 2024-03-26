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

  function getBoardWithValues() {
    return board.map(row => row.map(cell => cell.getValue()));
  }

  function placeMark(row, column, playerSymbol) {
    const currentSpot = board[row][column];
    if (currentSpot.getValue() != 0) {
      return false;
    } else {
      currentSpot.markSpot(playerSymbol);
      return true;
    }
  }

  function checkIfWon(playerSymbol) {
    const flatBoardWithValues = getBoardWithValues().flat();

    for (let rowIndex = 0; rowIndex < flatBoardWithValues.length; rowIndex += boardSize) {
      const row = flatBoardWithValues.slice(rowIndex, rowIndex + boardSize);

      // Check row
      if (row.every(item => item === playerSymbol)) {
        return true;
      }

      if (rowIndex = 0) {
        // Check column
        row.forEach((rowItem, index) => {
          let column = [];

          for (let columnIndex = index; columnIndex <= flatBoardWithValues.length - boardSize + index; columnIndex += boardSize) {
            column.push(flatBoardWithValues[columnIndex]);
          }
        })
      }
    }

    // const boardWithValues = getBoardWithValues();

    // boardWithValues.forEach((row, rowIndex) => {
    //   // Check row
    //   if (row.every((column, columnIndex, array) => column === array[0])) return true;

    //   if (rowIndex === 0) {
    //     row.forEach((column, columnIndex, array) => {
    //       let currentArray = []

    //       if ((columnIndex === 0) || (columnIndex === boardSize - 1)) {
    //         // Check diagonal
    //         currentArray.push(column);

    //         if (columnIndex === 0) {
    //           for (let index = 1; index < boardSize; index++) {
    //             currentArray.push(boardWithValues[index][index]);
    //           }
    //         } else {
              
    //         }
  
    //         if (currentArray.every((verticalItem, columnIndex, array) => verticalItem === array[0])) return true;

    //         currentArray = []
    //       }

    //       // Check column
    //       currentArray.push(column);

    //       for (let index = 1; index < boardSize; index++) {
    //         currentArray.push(boardWithValues[index][columnIndex]);
    //       }

    //       if (currentArray.every((verticalItem, columnIndex, array) => verticalItem === array[0])) return true;
    //     });
    //   }
    // });
  }

  function printBoard() {
    console.log(getBoardWithValues());
  }

  return {
    getBoard,
    placeMark,
    checkIfWon,
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