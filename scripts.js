const gameBoard = (() => {

    let gameState = [["","x",""],["","",""],["","",""]]

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
        let row = e.target.dataset.row
        let column = e.target.dataset.column
        // change this later
        let value = "x"
        updateGameState(row,column,value)
    })

    const updateGameState = (row,column,value) => {
        if (gameState[row][column]) {
            return
        } else {
        gameState[row][column] = value
        }
        render()
    }

    render()

    return {updateGameState}

})()

// const playerMaker = (name, value) => {
//     return {name, value}
// }

const createPlayersForm = (() => {

    //Cache DOM
    const modal = document.querySelector('.modal')
    const playerForm = document.querySelector('.modal-content')
    const playerFormInputs = playerForm.querySelectorAll('input')
    const submitBtn = playerForm.querySelector('#submit-btn')

    //make a player
    const playerMaker = (name,value) => {name, value}


    const clearAndHideForm = () =>  {playerFormInputs.forEach(input => {
            if(input.type == "radio"){input.checked = false} else {
                input.value = ''
            }
        })
        modal.style.display = "none"
    }

    return {clearAndHideForm}

})()

const game = () => {

    let players = []
}