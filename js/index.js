// FACTORIES

// MODULES
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

   return {
      getBoard,
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
   playerOne = 'Player 1',
   playerTwo = 'Player 2'
) {
   const gameboard = Gameboard();
   const board = gameboard.getBoard();

   const playRound = (playerToken, row, column) => {
      const targetedCell = board[row][column];

      targetedCell.updateVal(playerToken);
   };

   return {
      playRound,
   };
};

const game = GameController();