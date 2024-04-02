function GameOverModal() {
  const modal = document.querySelector(".modal");
  const restartButton = document.querySelector(".button__restart-game");

  modal.addEventListener("cancel", event => {
    event.preventDefault();
  });

  function showModal() {
    modal.showModal();
  }

  function onClickRestart(callbackFn) {
    return new Promise((resolve, reject) => {
      restartButton.addEventListener("click", () => {
        callbackFn();
        modal.close();
        resolve("done");
      });
    });
  }

  return {
    showModal,
    onClickRestart
  };
}

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

  function createBoard() {
    for (let i = 0; i < boardSize; i++) {
      board[i] = [];
      for (let j = 0; j < boardSize; j++) {
        board[i].push(Cell());
      }
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
    currentSpot.markSpot(playerSymbol);
  }

  function resetBoard() {
    for (let i = 0; i < boardSize; i++) {
      board[i] = [];
    }

    createBoard();
  }

  createBoard();

  return {
    getBoard,
    getBoardSize,
    getBoardWithValues,
    placeMark,
    resetBoard
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
        return true;
      }
  
      else if (rowIndex === 0) {
        // Check column
        for (let columnIndex = 0; columnIndex <= boardSize; columnIndex++) {
          let column = [];
          for (let index = columnIndex; index <= boardLength - boardSize + columnIndex; index += boardSize) column.push(flatBoardWithValues[index]);
    
          if (isEveryItemTheSame(column)) {
            return true;
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
  
          if (isEveryItemTheSame(diagonal)) return true;
        }
      }
  
      return false;
    }
  }

  function resetGame() {
    board.resetBoard();
  }

  function playTurn(row, column) {
    board.placeMark(row, column, currentPlayer.getSymbol());

    if (checkIfWon(currentPlayer.getSymbol())) {
      return {
        hasGameEnded: true,
        isTied: false,
        currentPlayer
      };
    } else if (checkIfBoardIsFull()) {
      return {
        hasGameEnded: true,
        isTied: true
      };
    } else {
      changePlayer();
      return {
        hasGameEnded: false,
        isTied: false
      };
    }
  }

  return {
    playTurn,
    getBoard: board.getBoard,
    resetGame
  }
}

function ScreenController() {
  const startButton = document.querySelector(".form__button-new-game");
  const divBoard = document.querySelector(".gameboard");
  const modal = GameOverModal();
  
  let game;

  startButton.addEventListener("click", event => {
    event.preventDefault();
    const playerOneName = document.querySelector("#player-one").value;
    const playerTwoName = document.querySelector("#player-two").value;

    game = GameController(playerOneName, playerTwoName);
    
    toggleNewGameScreen();
    addBoardListener();
    updateBoard();
  });

  function toggleNewGameScreen(headerText) {
    const startContainer = document.querySelector(".start-container");
    const startHeader = document.querySelector(".start__header");

    if (startContainer.style.display != "none") {
      startContainer.style.display = "none";
      divBoard.style.display = "initial";
    } else {
      startHeader.textContent = headerText;
      startContainer.style.display = "initial";
      divBoard.style.display = "none";
    }
  }
  
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
  
  function addBoardListener() {
    divBoard.addEventListener("click", (event) => {
      if (event.target.className === "gameboard__button") {
        const row = event.target.dataset.row;
        const column = event.target.dataset.column;
        const result = game.playTurn(row, column);
        
        updateBoard();

        if (result.isTied) {
          modal.onClickRestart(game.resetGame)
               .then(() => updateBoard());
          modal.showModal();
        } else if (result.hasGameEnded) {
          modal.showModal();
          modal.onClickRestart(game.resetGame)
               .then(() => updateBoard());
        }
      }
    });
  }
}

ScreenController();

// const gameResultModal = document.querySelector(".modal__game-result");
// const openModal = document.querySelector(".button__show-modal");
// openModal.addEventListener("click", () => gameResultModal.showModal());