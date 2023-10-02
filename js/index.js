// FACTORIES

// MODULES
const gameboard = () => {
   const board = []; // shall be 2D
   const rows = 3;
   const columns = 3;

   for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
         board[i][j] = Cell();
      }
   }

   
}

