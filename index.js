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

  function getBoardSize() {
    return boardSize;
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

  function printBoard() {
    console.log(getBoardWithValues());
  }

  return {
    getBoard,
    getBoardSize,
    getBoardWithValues,
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
    console.log(`It\'s ${currentPlayer.getName()}'s turn now.`);
  }

  function checkIfBoardIsFull() {
    return !board.getBoardWithValues().flat().some(item => item === 0);
  }

  function checkIfWon(playerSymbol) {
    const flatBoardWithValues = board.getBoardWithValues().flat();
    const boardLength = flatBoardWithValues.length;
    const boardSize = board.getBoardSize();

    function isEveryItemTheSame(array) {
      return array.every(item => item === playerSymbol)
    }
  
    for (let rowIndex = 0; rowIndex <= boardLength - boardSize; rowIndex += boardSize) {
      const row = flatBoardWithValues.slice(rowIndex, rowIndex + boardSize);
    
      // Check row
      if (isEveryItemTheSame(row)) {
        return {row};
      }
  
      else if (rowIndex === 0) {
        // Check column
        for (let columnIndex = 0; columnIndex <= boardSize; columnIndex++) {
          let column = [];
          for (let index = columnIndex; index <= boardLength - boardSize + columnIndex; index += boardSize) column.push(flatBoardWithValues[index]);
    
          if (isEveryItemTheSame(column)) {
            return {column};
          }
        }
  
        // Check diagonal
        for (let columnIndex = 0; columnIndex <= boardSize; columnIndex += (boardSize - 1)) {
          let diagonal = [];
          if (columnIndex === 0) {
            // console.log("this");
            for (let index = columnIndex; index <= boardLength - 1; index += (boardSize + 1)) diagonal.push(flatBoardWithValues[index]);
          } else if (columnIndex === boardSize - 1) {
            // console.log(columnIndex);
            for (let index = columnIndex; index <= boardLength - boardSize; index += (boardSize - 1)) diagonal.push(flatBoardWithValues[index]);
          }
  
          if (isEveryItemTheSame(diagonal)) return {diagonal};
        }
      }
  
      return false;
    }
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

    if (checkIfWon(currentPlayer.getSymbol())) {
      console.log(`${currentPlayer.getName()} has won the game!`);
      return {
        isGameOver: true,
        isTied: false,
        currentPlayer
      };
    } else if (checkIfBoardIsFull()) {
      return {
        isGameOver: true,
        isTied: true
      };
    } else {
      changePlayer();
      return {
        isGameOver: false,
        isTied: false
      };
    }
  }
  
  board.printBoard();
  console.log(`It\'s ${currentPlayer.getName()}'s turn now.`);

  return {
    playTurn,
    getBoard: board.getBoard 
  }
}

function ScreenController() {
  const game = GameController();
  const divBoard = document.querySelector(".gameboard");
  
  function updateBoard() {
    divBoard.textContent = "";

    const board = game.getBoard();
    board.forEach((row, rowIndex) => {
      const boardRow = document.createElement("div");
      boardRow.classList.add("gameboard__row");
  
      row.forEach((column, columnIndex) => {
        const boardItem = document.createElement("button");
        boardItem.setAttribute("type", "button");
        boardItem.classList.add("gameboard__button");
        boardItem.dataset.row = rowIndex;
        boardItem.dataset.column = columnIndex;
  
        if (column.getValue() === 0) {
          boardItem.innerHTML = "&nbsp;";
        } else {
          boardItem.innerHTML = column.getValue();
          boardItem.setAttribute("disabled", "true");
        }
        // boardItem.innerHTML = column.getValue() === 0 ? "&nbsp;" : column.getValue();
        boardRow.appendChild(boardItem);
      });
  
      divBoard.appendChild(boardRow);
    });
  }

  function disableBoardTie() {
    divBoard.textContent = "The game was a tie!";
  }

  function disableBoardWin(winner) {
    divBoard.textContent = `${winner} has won!`;
  }
  
  function addListener() {
    divBoard.addEventListener("click", (event) => {
      if (event.target.className === "gameboard__button") {
        const row = event.target.dataset.row;
        const column = event.target.dataset.column;
        const result = game.playTurn(row, column);
        
        if (!result.isGameOver) {
          updateBoard();
        } else if (result.isTied) {
          disableBoardTie();
        } else {
          disableBoardWin(result.currentPlayer.getName());
        }
      }
    });
  }

  addListener();
  updateBoard();
}

ScreenController();