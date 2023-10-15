__|__|__
__|__|__
  |  |

what are the main 'interfaces', so to speak?

CONSOLE
X> gameboard
X   > printBoard (to console)
X> cells
X> player info
X   > name
X   > token
X> gameControls
X   > playRound
X   > checkIfWinner

LATER
> displayControls
    > Controls need to freeze/disappear once a win is detected
> form/start/reset button logic
  > When start button is visible (initial pre-game state)
    > player names are modifiable
      > previously used names remain
    > both start button and clicking anywhere on the board should trigger the same thing
    > clicking start should:
      > save names
      > initialize the game
      > change button to reset
  > when reset is button is visible (in-game state)
    > names input fields disappear
    > 

Hit start
  > check if form is valid
    > store player names
    > Game.initGame()
    > updateAllDisplayCells()
    > listenToDisplayCellClicks(true)
    > displayForm(false)
    
    > toggleStartButtonValue()