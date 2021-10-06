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
        if(game.getCurrentPlayer().name == computer.name){return}

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
        if(computer.moveNumber == 5){
            console.log("its a draw, well played")
            return
        }

        // prevent computer from playing if its game over
        if(game.getState() == 0){return}

        if(game.getCurrentPlayer().name == "Computer"){
            setTimeout(() => {
                let computerMove = computer.playMove()
                console.log(computerMove)
                let row = computerMove.row
                let column = computerMove.column
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

const computer = (() => {
    let name = "Computer"
    let gameState = gameBoard.getGameState()

    // horribly written function to get computer value ("O" or "X")
    const getMyValue = () => {
        return createPlayersForm.getPlayers().filter(player => {
            return player.name == name
        })[0].value
    }

    // get all moves computer has played
    const getComputerMoves = () => {
        let computerMoves = []
        for(let row = 0; row < 3; row++){
            for(let column = 0; column < 3; column++){
                if(gameState[row][column] == getMyValue()){
                    computerMoves.push({row,column})
                }
            }
        }
        return computerMoves
    }

    const getHumanValue = () =>  getMyValue() == "X" ? "O" : "X"

    // get all moves human has played
    const getHumanMoves = () => {
        let humanMoves = []
        for(let row = 0; row < 3; row++){
            for(let column = 0; column < 3; column++){
                if(gameState[row][column] == getHumanValue()){
                    humanMoves.push({row,column})
                }
            }
        }
        return humanMoves
    }

    let moveNumber = 1

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

        // helper function to get random value from an array
        const randomArrValue = (arr) => arr[Math.floor(Math.random() * arr.length)]

        // pick a corner helper function
        const pickCorner = () => {
            let corners = availableMoves.filter(move => {
                return (move.row == 0 && move.column == 0) ||
                (move.row == 2 && move.column == 0) ||
                (move.row == 0 && move.column == 2) ||
                (move.row == 2 && move.column == 2)
            })
            let randomCorner = randomArrValue(corners)
            return randomCorner
        }

        // pick an edge helper function
        const pickEdge = () => {
            let edges = availableMoves.filter(move => {
                return (move.row == 0 && move.column == 1) ||
                (move.row == 1 && move.column == 0) ||
                (move.row == 1 && move.column == 2) ||
                (move.row == 2 && move.column == 1)
            })
            let randomEdge = randomArrValue(edges)
            return randomEdge
        }

        // first move
        const pickFirstMove = () => {
            let humanFirstMove = getHumanMoves()[0]
            // if human picked center then pick a corner
            if(humanFirstMove.row == 1 && humanFirstMove.column == 1){
                return pickCorner()
            } else {
                return {"row": 1, "column": 1}
            }
        }

        // simulate a move
        const simulateMove = (move,value) => {
            let simulatedState = []
            gameState.forEach(arr => {
                let clone = [...arr]
                simulatedState.push(clone)
            })
            simulatedState[move.row][move.column] = value
            return simulatedState
        }

        // check which value has won a game
        const checkWhoWon = board => {
            let winner
            for(let row = 0; row < 3; row++){
                if(board[row][0]){
                    if(board[row][0] == board[row][1] && board[row][0] == board[row][2]){
                    winner = board[row][0] 
                    }
                }
            }
            for(let column = 0; column < 3; column++){
                if(board[0][column]){
                    if(board[0][column] == board[1][column] && board[0][column] ==  board[2][column]){
                    winner = board[0][column]
                    }
                }
            }
            if(board[1][1]){
                if((board[0][0] == board[1][1] && board[0][0]  ==  board[2][2]) || (board[2][0] == board[1][1] && board[2][0] ==  board[0][2])){
                    winner = board[1][1]
                }
            }
            if(winner){return winner}
        }

        // see if there is a winning move
        const getWinningMoves = (moveValue) => {
            let winningMoves = []
            availableMoves.forEach(potentialMove => {
                let simulatedBoard = simulateMove(potentialMove,moveValue)
                if(checkWhoWon(simulatedBoard) == moveValue){
                    winningMoves.push(potentialMove)
                }
            })
            return winningMoves
        }

        // get a winning move if available
        const tryAndWin = () => {
            let myValue = getMyValue()
            let winningMoves = getWinningMoves(myValue)
            if(winningMoves.length > 0){
                return winningMoves[0]
            }
        }

        // block human from winning
        const tryAndBlock = () => {
            let humanValue = getHumanValue()
            let winningMoves = getWinningMoves(humanValue)
            if(winningMoves.length > 0){
                return winningMoves[0]
            }
        }

        const randmonMove = () => {
            return randomArrValue(availableMoves)
        }

        // check if human has played opposing corners
        const checkOppositeCorners = () => {
            let humanMoves = getHumanMoves().sort()
            if(humanMoves.length > 2){return}
            let corner1 = {"row":0,"column":0}
            let corner2 = {"row":0,"column":2}
            let corner3 = {"row":2,"column":0}
            let corner4 = {"row":2,"column":2}
            let cornerGroup1 = [corner1,corner4].sort()
            let cornerGroup2 = [corner2,corner3].sort()
            if(JSON.stringify(humanMoves) == JSON.stringify(cornerGroup1) || JSON.stringify(humanMoves) == JSON.stringify(cornerGroup2)){
                return true
            } else return false
        }

        // actual move
        const moveToPlay = () => {
            if(moveNumber == 1){
                console.log('playing first move')
                moveNumber++
                return pickFirstMove()
            } else if (moveNumber == 2 && checkOppositeCorners()){
                console.log('playing opppsing corner because you picked opposing corners')
                moveNumber++
                return pickEdge()
            } else if (tryAndWin()){
                console.log('gonna try and win')
                moveNumber++
                return tryAndWin()
            } else if (tryAndBlock()){
                console.log('ill stop you')
                moveNumber++
                return tryAndBlock()
            } else {
                console.log('meh ill try anything')
                moveNumber++
                return  randmonMove()}
        }

        console.log(moveNumber)

        return moveToPlay()
    }


    return {name,playMove,moveNumber}
})()