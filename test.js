const boardRow = [
  [0, 0, 0],
  ["X", "X", "X"],
  [0, 0, 0],
];

const boardColumn = [
  [0, "X", 0],
  [0, "X", 0],
  [0, "X", 0]
];

const boardDiagonalLtr = [
  ["X", 0, 0],
  [0, "X", 0],
  [0, 0, "X"],
];

const boardDiagonalRtl = [
  [0, 0, "X"],
  [0, "X", 0],
  ["X", 0, 0]
];

// [0, 0, 0, "X", "X", "X", 0, 0, 0],
// [0, 1, 2, 3, 4, 5, 6, 7, 8,]
// 0, 1, 2
// 3, 4, 5
// 6, 7, 8
const flatBoardWithValues = boardDiagonalRtl.flat();
const boardSize = 3;
const boardLength = flatBoardWithValues.length;

function checkIfWon(playerSymbol = "X") {
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

console.log(checkIfWon());