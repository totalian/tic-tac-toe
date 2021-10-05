const gameBoard = (() => {

    const gameState = [["","",""],["","",""],["","",""]]

    const getGameState = () => gameState

    //Cache DOM Elements
    let gameBoard = document.querySelector('.game-board')

    //make grid pieces which go onto the game board and render in DOM
    const render = () => {
        //empty board of any current grid pieces
        while(gameBoard.firstChild){
            gameBoard.removeChild(gameBoard.lastChild)
        }

        //make new grid pieces 
        for(let i = 0; i < 3; i++){
            for(let j = 0; j < 3; j++){
                let gridPiece = document.createElement('div')

                //add identifiers to data-attributes
                gridPiece.dataset.row = i
                gridPiece.dataset.column = j

                //add styling
                gridPiece.classList.add('grid-piece')
                gridPiece.textContent = gameState[i][j]
                if(i == 1){gridPiece.classList.add('grid-row')}
                if(j == 1){gridPiece.classList.add('grid-column')}

                //add to board
                gameBoard.appendChild(gridPiece)
            }
        }
    }

    //Bind DOM events
    gameBoard.addEventListener('click', e => {

        // prevent player from playing when its computer move
        if(game.getCurrentPlayer().name == "computer"){return}

        // prevent player from playing when game is over
        if(game.getState() == 0){return}

        // player move
        let row = e.target.dataset.row
        let column = e.target.dataset.column
        let value = game.getCurrentPlayer().value
        updateGameState(row,column,value)
        
        // check if game over then switch player
        game.checkWin()
        game.playerSwitch()

        // computer move
        computerMove()

    })

    // Computer move
    const computerMove = () => {

        // prevent computer from playing if its game over
        if(game.getState() == 0){return}

        if(game.getCurrentPlayer().name == "computer"){
            setTimeout(() => {
                let row = computer().playMove().row
                let column = computer().playMove().column
                let value = game.getCurrentPlayer().value
                updateGameState(row,column,value)
                game.checkWin()
                game.playerSwitch()
            }, 1500);
        }
    }

    // function to update the array holding all the values with a specific value
    const updateGameState = (row,column,value) => {
        if (gameState[row][column]) {
            return
        } else {
        gameState[row][column] = value
        }
        render()
    }

    render()

    return {getGameState}

})()


const createPlayersForm = (() => {

    const players = []

    const getPlayers = () => players

    //Cache DOM
    const modal = document.querySelector('.modal')
    const playerForm = document.querySelector('.modal-content')
    const playerFormInputs = playerForm.querySelectorAll('input')
    const submitBtn = playerForm.querySelector('#submit-btn')
    const playerOneNameInput = playerForm.querySelector('#player-1-name')
    const playerOneValueOptions = playerForm.querySelectorAll('.player-one-value-options input')
    const playerTwoNameInput = playerForm.querySelector('#player-2-name')
    const playerTwoNameInputLabel = playerForm.querySelector('#player-2-name-label')
    const playerTwoOpponentTypes = playerForm.querySelectorAll('.opponents input')

    //bind DOM
    submitBtn.addEventListener('click',() => {
        makeAllPlayers()
        clearAndHideForm()
    })

    // hide the player 2 name input form if selecting computer
    Array.from(playerTwoOpponentTypes).forEach(input => {
        input.addEventListener('click',e => {
            if(e.target.value == "computer"){
                playerTwoNameInput.classList.add('hidden')
                playerTwoNameInputLabel.classList.add('hidden')
            } else {
                playerTwoNameInput.classList.remove('hidden')
                playerTwoNameInputLabel.classList.add('hidden')
            }
        })
    })


    //make a player
    const playerMaker = (name,value) => {
        return {name,value}
    }

    //clear and hide form function
    const clearAndHideForm = () =>  {playerFormInputs.forEach(input => {
            if(input.type == "radio"){input.checked = false} else {
                input.value = ''
            }
        })
        modal.style.display = "none"
    }

    // create players from form
    const makeAllPlayers = () => {
        let playerOneName = playerOneNameInput.value

        let playerOneValue
        Array.from(playerOneValueOptions).forEach(input => {
            if(input.checked){
                playerOneValue = input.value
            }
        })

        let playerOne = playerMaker(playerOneName,playerOneValue)
        players.push(playerOne)

        let opponentChoice
        Array.from(playerTwoOpponentTypes).forEach(input => {
            if(input.checked){
                opponentChoice = input.value
            }
        })

        if(opponentChoice == "human"){
            let opponentName = playerTwoNameInput.value
            let opponentValue = playerOneValue == "X" ? "O" : "X"
            let opponent = playerMaker(opponentName,opponentValue)
            players.push(opponent)
        } else {
            let opponentName = computer.name
            let opponentValue = playerOneValue == "X" ? "O" : "X"
            let opponent = playerMaker(opponentName,opponentValue)
            players.push(opponent)
        }

    }

    return {getPlayers}

})()

const game = (() => {

    // State: 1 = live; 0 = game over
    let state = 1

    let players = createPlayersForm.getPlayers()
    let gameState = gameBoard.getGameState()

    const getCurrentPlayer = () => players[0]

    const getState = () => state

    // change current player
    const playerSwitch = () => {
        let currentPlayer = players[0]
        players[0] = players[1]
        players[1] = currentPlayer
    }

    // check if someone has won the game
    const checkWin = () => {
        let winner
        for(let row = 0; row < 3; row++){
            if(gameState[row][0]){
                if(gameState[row][0] == gameState[row][1] && gameState[row][0] == gameState[row][2]){
                state = 0
                winner = players[0]
                }
            }
        }
        for(let column = 0; column < 3; column++){
            if(gameState[0][column]){
                if(gameState[0][column] == gameState[1][column] && gameState[0][column] ==  gameState[2][column]){
                state = 0
                winner = players[0]
                }
            }
        }
        if(gameState[1][1]){
            if((gameState[0][0] == gameState[1][1] && gameState[0][0]  ==  gameState[2][2]) || (gameState[2][0] == gameState[1][1] && gameState[2][0] ==  gameState[0][2])){
                state = 0
                winner = players[0]
            }
        }
        if(winner){return winner}
    }

    return {getCurrentPlayer, playerSwitch, checkWin, getState}

})()

const computer = () => {
    let name = "Computer"
    
    let gameState = gameBoard.getGameState()

    // function to get available moves
    const getAvailableMoves = () => {
        let availableMoves = []
        for(let row = 0; row < 3; row++){
            for(let column = 0; column < 3; column++){
                if(gameState[row][column] == ""){
                    availableMoves.push({row,column})
                }
            }
        }
        return availableMoves
    }

    const playMove = () => {
        let availableMoves = getAvailableMoves()

        // pick a random available move
        let randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)]
        return randomMove
    }


    return {name,playMove}
}