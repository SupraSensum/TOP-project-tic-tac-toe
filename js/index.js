const Cell = (row, column) => {
   const address = {
      row,
      column,
   };
   let value = 0;

   const getAddress = () => address;
   const getVal = () => value;
   const updateVal = (newVal) => {
      value = newVal;
   }

   return {
      getAddress,
      getVal,
      updateVal,
   };
};

const Gameboard = (() => {
   const board = [];
   const rows = 3;
   const columns = 3;
   
   const initBoard = () => {
      for (let i = 0; i < rows; i++) {
         board[i] = [];
         for (let j = 0; j < columns; j++) {
            board[i][j] = Cell(i, j);
         }
      }
   };
   
   const getBoard = () => board;

   const printBoard = () => {
      const printableBoard = board.map(
         (row) => row.map(
            (cell) => cell.getVal()
         )
      );
      console.table(printableBoard);
   };

   return {
      initBoard,
      getBoard,
      printBoard,
   };
})();

const Game = (() => {
   let players;
   let board;
   let currentPlayer;
   let movesMade;

   const initGame = (playerOneName = 'Player 1', playerTwoName = 'Player 2') => {
      players = [
         {
            name: playerOneName,
            token: 'X',
         },
         {
            name: playerTwoName,
            token: 'O',
         }
      ];
      
      Gameboard.initBoard();
      board = Gameboard.getBoard();
      currentPlayer = 0;
      movesMade = 0;

      console.log("Game has been initialized");

      Gameboard.printBoard();
      alertCurrentPlayerTurn();
   };
   
   const getCurrentPlayerToken = () => players[currentPlayer].token;
   const getCurrentPlayerName = () => players[currentPlayer].name;

   const toggleCurrentPlayer = () => {
      currentPlayer = 1 - currentPlayer;
      alertCurrentPlayerTurn();
   };
   
   const alertCurrentPlayerTurn = () => {
      console.log(`${getCurrentPlayerName()} [${getCurrentPlayerToken()}], you're up!`);
   };
   
   const weGotAWinnerrr = () => {
      console.log(`${getCurrentPlayerName()} is a motha lovin' winnaaa`);
   };

   const weGotATie = () => {
      console.log(`aaand it's a tie`);
   };
   
   const isWinningMove = (row, column) => {
      const currentPlayerToken = getCurrentPlayerToken();

      const directions = [
         [[0, 0], [0, 1], [0, 2]], // First row
         [[1, 0], [1, 1], [1, 2]], // Second row
         [[2, 0], [2, 1], [2, 2]], // Third row
         [[0, 0], [1, 0], [2, 0]], // First column
         [[0, 1], [1, 1], [2, 1]], // Second column
         [[0, 2], [1, 2], [2, 2]], // Third column
         [[0, 0], [1, 1], [2, 2]], // Diagonal from top-left to bottom-right
         [[0, 2], [1, 1], [2, 0]]  // Diagonal from top-right to bottom-left
      ];

      for (const direction of directions) {
         let counter = 0;
         for (const [r, c] of direction) {
            if (board[r][c].getVal() === currentPlayerToken) {
               counter++;
            }
         }
         if (counter >= 3) {
            return true;
         }
      }

      return false
   };

   const isTie = (row, column) => {
      return (movesMade >= 9) && !isWinningMove(row, column) ? true : false;
   };

   const cellIsEmpty = (cell) => cell.getVal() === 0;

   const processRoundOutcome = (row, column) => {
      if (isWinningMove(row, column)) {
         weGotAWinnerrr();
      } else if (isTie(row, column)) {
         weGotATie();
      } else {
         toggleCurrentPlayer();
      }
   };
   
   const playRound = (row, column) => {
      const targetedCell = board[row][column];
      
      if (cellIsEmpty(targetedCell)) {
         targetedCell.updateVal(getCurrentPlayerToken());
         Gameboard.printBoard();
         movesMade++;

         processRoundOutcome(row, column);
      } else {
         console.warn('Cell is already occupied'); // this effectively serves as collision management, preventing overwriting previous moves, keeping the game state completely unchanged
      }
   };

   return {
      playRound,
      initGame,
   };
})();

const DisplayController = (() => {
   const cells = document.querySelectorAll(".gameboard .cell");

   for (const cell of cells) {
      cell.addEventListener('click', (event) => handleCellClick(event));
   }
   
   const updateCellDisplay = (cell, row, column) => {
      const cellVal = Gameboard.getBoard()[row][column].getVal();
      
      cell.textContent = cellVal;
   };

   const handleCellClick = (event) => {
      const clickedCell = event.target;
      const clickedCellRow = parseInt(clickedCell.dataset.row);
      const clickedCellColumn = parseInt(clickedCell.dataset.column);

      Game.playRound(clickedCellRow, clickedCellColumn);

      updateCellDisplay(clickedCell, clickedCellRow, clickedCellColumn);
   };

})();