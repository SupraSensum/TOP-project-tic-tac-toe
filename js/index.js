function Gameboard() {
   const board = []; // shall be 2D
   const rows = 3;
   const columns = 3;
   
   const createBoard = (() => { // opted for IIFE for self-documentation
      for (let i = 0; i < rows; i++) {
         board[i] = [];
         for (let j = 0; j < columns; j++) {
            board[i][j] = Cell(i, j);
         }
      }
   })();
   
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
      getBoard,
      printBoard,
   };
};

function Cell(row, column) {
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

function GameController(
   playerOneName = 'Player 1',
   playerTwoName = 'Player 2'
) {
   const players = [
      playerOne = {
         name: playerOneName,
         token: 'X',
      },
      playerTwo = {
         name: playerTwoName,
         token: 'O',
      },
   ];
   const gameboard = Gameboard();
   const board = gameboard.getBoard();
   let currentPlayer = 0;
   
   const getCurrentPlayerToken = () => players[currentPlayer].token;
   const getCurrentPlayerName = () => players[currentPlayer].name;

   const toggleCurrentPlayer = () => {
      currentPlayer = 1 - currentPlayer;
      console.log(`${getCurrentPlayerName()} [${getCurrentPlayerToken()}], you're up!`);
   };
   
   const weGotAWinnerrr = () => {
      console.log(`${getCurrentPlayerName()} is a motha fuckin' winnaaaaaaaaaaaaa`);
   }
   
   const checkIfWin = (row, column) => {
      let counter = 0;
      currentPlayerToken = getCurrentPlayerToken();

      // Check backslash-shaped diagonal
      for (let i = 0; i < 3; i++) {
         if (board[i][i].getVal() === currentPlayerToken) {
            counter++;
         }
      }
      if (counter >= 3) {
         weGotAWinnerrr();
         return;
      }
      counter = 0;

      // Check forwardslash-shaped diagonal
      for (let i = 0; i < 3; i++) {
         if (board[i][2 - i].getVal() === currentPlayerToken) {
            counter++;
         }
      }
      if (counter >= 3) {
         weGotAWinnerrr();
         return;
      }
      counter = 0;

      // Check horizontal
      for (let i = 0; i < 3; i++) {
         if (board[row][i].getVal() === currentPlayerToken) {
            counter++;
         }
         console.log({row, i, currentPlayerToken}, board[row][i].getVal(), board[row][i].getVal() === currentPlayerToken);
      }
      if (counter >= 3) {
         weGotAWinnerrr();
         return;
      }
      counter = 0;

      // Check vertical
      for (let i = 0; i < 3; i++) {
         if (board[i][column].getVal() === currentPlayerToken) {
            counter++;
         }
      }
      if (counter >= 3) {
         weGotAWinnerrr();
         return;
      }
   }
   
   const playRound = (row, column) => {
      const targetedCell = board[row][column];
      
      if (targetedCell.getVal() === 0) { // only do voodoo if cell is "empty"
         targetedCell.updateVal(getCurrentPlayerToken());
         gameboard.printBoard();
         checkIfWin(row, column); // params are so we have access to the last move
         toggleCurrentPlayer();
      } else {
         console.warn('Cell is already occupied'); // this effectively serves as collision management, preventing overwriting previous moves
      }
   };

   return {
      playRound,
   };
};

const game = GameController();