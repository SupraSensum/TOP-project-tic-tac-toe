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

   const handleOccupiedCell = () => {
      const warningMsg = 'Cell is already occupied';
      console.warn(warningMsg);
   };
   
   const playRound = (row, column) => {
      const targetedCell = board[row][column];
      
      if (cellIsEmpty(targetedCell)) {
         targetedCell.updateVal(getCurrentPlayerToken());
         Gameboard.printBoard();
         movesMade++;

         processRoundOutcome(row, column);
      } else {
         handleOccupiedCell(); // this effectively serves as collision management, preventing overwriting previous moves, keeping the game state completely unchanged
      }
   };

   return {
      playRound,
      initGame,
   };
})();

const DisplayController = (() => {
   const cells = document.querySelectorAll(".gameboard .cell");
   const startButton = document.getElementById('start-button');
   let playerNames;

   const getDisplayCellAddress = (cell) => {
      return {
         row: cell.dataset.row,
         column: cell.dataset.column,
      };
   };
   
   const updateDisplayCell = (cell, row, column) => {
      const cellVal = Gameboard.getBoard()[row][column].getVal();
      
      cell.textContent = cellVal === 0 ? '' : cellVal;
   };

   const handleDisplayCellClick = (event) => {
      const clickedCell = event.target;
      const cellAddress = getDisplayCellAddress(clickedCell);

      Game.playRound(cellAddress.row, cellAddress.column);

      updateDisplayCell(clickedCell, cellAddress.row, cellAddress.column);
   };

   const updateDisplayBoard = () => {
      for (const cell of cells) {
         const cellAddress = getDisplayCellAddress(cell);

         updateDisplayCell(cell, cellAddress.row, cellAddress.column);
      }
   };

   const clearDisplayBoard = () => {
      for (const cell of cells) {
         cell.textContent = '';
      }
   };

   const listenToDisplayCellClicks = (isEnabled) => {
      if (typeof isEnabled === 'boolean') {
         
         // Prevent accumulation of duplicate event listeners by removing them
         //    regardless. No need to check first since this is apparently a
         //    safe approach.
         for (const cell of cells) {
            cell.removeEventListener('click', handleDisplayCellClick);
         }

         if (isEnabled) {
            for (const cell of cells) {
               cell.addEventListener('click', handleDisplayCellClick);
            }
         }
      } else {
         console.log("Error: Input is not a boolean.");
      }
   };

   const playersFormIsValid = () => {
      const player1Input = document.getElementById('player1');
      const player2Input = document.getElementById('player2');

      const player1Value = player1Input.value.trim();
      const player2Value = player2Input.value.trim();

      const player1Valid = player1Value.length >= 2 && player1Value.length <= 30;
      const player2Valid = player2Value.length >= 2 && player2Value.length <= 30;

      if (!player1Valid) {
         alert('Player 1 Name must be between 2 and 30 characters.');
         return false;
      }

      if (!player2Valid) {
         alert('Player 2 Name must be between 2 and 30 characters.');
         return false;
      }

      return true;
   };

   const getPlayerNames = () => {
      return {
         p1: document.getElementById('player1').value.trim(),
         p2: document.getElementById('player2').value.trim(),
      };
   };

   const showForm = (isEnabled) => {
      const inputContainer = document.querySelector('.input-container');
      const formHTML = `
         <form>
            <div class="input-group">
               <label for="player1" style="display: none;">Player 1 Name:</label>
               <input type="text" id="player1" name="player1" required minlength="2" maxlength="30" placeholder="Player 1">
            </div>

            <div class="input-group">
               <label for="player2" style="display: none;">Player 2 Name:</label>
               <input type="text" id="player2" name="player2" required minlength="2" maxlength="30" placeholder="Player 2">
            </div>
         </form>
      `;

      if (typeof isEnabled === 'boolean') {
         const currentForm = document.querySelector('.input-container form');

         if (currentForm) {
            currentForm.remove();
         }

         if (isEnabled) {
            inputContainer.insertAdjacentHTML('afterbegin', formHTML);

            if (playerNames) {
               const player1Input = document.getElementById('player1');
               const player2Input = document.getElementById('player2');

               player1Input.value = playerNames.p1;
               player2Input.value = playerNames.p2;
            }
         }
      } else {
         console.log("Error: Input is not a boolean.");
      }
   };

   const handleStartButton = (event) => {
      const startButton = event.target;
      
      if (startButton.value === 'Start') {
         if (playersFormIsValid()) {
            playerNames = getPlayerNames();
            startButton.value = 'Reset';
            Game.initGame(playerNames.p1, playerNames.p2);
            updateDisplayBoard();
            listenToDisplayCellClicks(true);
            showForm(false);
         }
      } else {
         startButton.value = 'Start';
         clearDisplayBoard();
         listenToDisplayCellClicks(false);
         showForm(true);
      }
   };

   startButton.addEventListener('click', (event) => handleStartButton(event));

})();