// FACTORIES

// MODULES
function Gameboard() {
   const board = []; // shall be 2D
   const rows = 3;
   const columns = 3;
   
   for (let i = 0; i < rows; i++) {
      board[i] = [];
      for (let j = 0; j < columns; j++) {
         board[i][j] = Cell(i, j);
      }
   }
   
   const getBoard = () => board;

   return {
      getBoard,
   };
}

function Cell(row, column) {
   const address = {
      row,
      column,  
   };
   let value = 0;

   const getAddress = () => address;
   const getVal = () => value;

   return {
      getAddress,
      getVal,
   };
};