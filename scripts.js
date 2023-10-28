(function() {

    'use strict'

    const game = {

        currentPlayer: '',

        delayOfComputerInSeconds: [2, 4],

        isEndOfTheGame: false,

        symbols: ['X', 'O'],

        totalCells: 9,

        totalFilledCells: 0,

        totalComputerWins: 0,

        totalPlayerWins: 0,

        winningSequences: [

            // HORIZONTAL
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],

            // VERTICAL
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],

            // DIAGONAL
            [0, 4, 8],
            [2, 4, 6]

        ],

        interface: {

            cells: Array.from(document.querySelectorAll('.cell')),

            currentPlayerName: document.getElementById('current-player-name'),

            newGame: document.getElementById('new-game'),

            totalComputerWins: document.getElementById('total-wins-computer'),

            totalPlayerWins: document.getElementById('total-wins-player'),

            writeInTheCell(cell, symbol) {
                cell.textContent = symbol
            },

            writeCurrentPlayerName() {
                if (!game.getCurrentPlayer())
                    game.interface.currentPlayerName.textContent = '-'
                else 
                    game.interface.currentPlayerName.textContent = (game.getCurrentPlayer() === game.getSymbols(0)) ? 'Rafael Chelas' : 'Computador'
            },

            writeScoreboard() {
                game.interface.totalPlayerWins.textContent = game.totalPlayerWins
                game.interface.totalComputerWins.textContent = game.totalComputerWins
            }

        },

        changeCurrentPlayer() {
            if (game.getCurrentPlayer()) {
                let index = (game.getCurrentPlayer() === game.getSymbols(0)) ? 1 : 0
                this.setCurrentPlayer(index)
            }
        },

        checkTheWinner(symbol) {

            for (let row of game.winningSequences) {

                if (game.interface.cells[row[0]].textContent === symbol &&
                    game.interface.cells[row[1]].textContent === symbol &&
                    game.interface.cells[row[2]].textContent === symbol) {

                    game.setIsEndOfTheGame(true)

                    symbol === game.getSymbols(0) ? game.totalPlayerWins++ : game.totalComputerWins++

                    game.interface.writeScoreboard()

                    game.setCurrentPlayer(null)

                    game.interface.writeCurrentPlayerName()

                    return

                }

            }

        },

        cleanTheBoard() {
            game.interface.cells.forEach(cell => {
                cell.textContent = ''
            })
        },

        computerPlays() {

            if (!game.getIsEndOfTheGame() &&
                game.getTotalFilledCells() < game.getTotalCells() &&
                game.getCurrentPlayer() === game.getSymbols(1)) {

                let delay = game.generateRandomInteger(...game.delayOfComputerInSeconds) * 1000

                setTimeout(() => {

                    let randomNumber = game.getNumberToWin()

                    if (typeof randomNumber !== 'number') {

                        randomNumber = game.getNumberToPreventOpponentWin()

                        if (typeof randomNumber !== 'number')
                            randomNumber = game.getRandomNumber()

                    }

                    game.interface.writeInTheCell(game.interface.cells[randomNumber], game.getSymbols(1))

                    game.totalFilledCells++

                    game.checkTheWinner(game.getSymbols(1))

                    if (!game.getIsEndOfTheGame()) {

                        game.getTotalFilledCells() === game.getTotalCells() ? game.setCurrentPlayer(null) : game.changeCurrentPlayer()

                        game.interface.writeCurrentPlayerName()

                    }

                }, delay)

            }

        },

        generateRandomInteger(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min
        },

        getNumberToPreventOpponentWin() {

            for (let row of game.winningSequences) {

                let totalOccurrences = 0
                let randomNumber = false

                for (let column of row) {

                    if (game.interface.cells[column].textContent === game.getSymbols(1))
                        break

                    else if (game.interface.cells[column].textContent === game.getSymbols(0))
                        totalOccurrences++

                    else
                        randomNumber = column

                }

                if (totalOccurrences === 2)
                    return randomNumber

            }

            return false

        },

        getNumberToWin() {

            for (let row of game.winningSequences) {

                let totalOccurrences = 0
                let randomNumber = false

                for (let column of row) {

                    if (game.interface.cells[column].textContent === game.getSymbols(0))
                        break

                    else if (game.interface.cells[column].textContent === game.getSymbols(1))
                        totalOccurrences++

                    else
                        randomNumber = column

                }

                if (totalOccurrences === 2)
                    return randomNumber

            }

            return false

        },

        getRandomNumber() {

            let randomInteger = game.generateRandomInteger(0, game.getTotalCells() - 1)

            while (game.interface.cells[randomInteger].textContent !== '')
                randomInteger = game.generateRandomInteger(0, game.getTotalCells() - 1)

            return randomInteger

        },

        start() {

            game.interface.writeScoreboard()

            game.setCurrentPlayer(game.generateRandomInteger(0, 1))

            game.interface.writeCurrentPlayerName()

            game.interface.cells.forEach(cell => {

                cell.addEventListener('click', () => {

                    if (!game.getIsEndOfTheGame() &&
                        game.getTotalFilledCells() < game.getTotalCells() &&
                        game.getCurrentPlayer() === game.getSymbols(0) &&
                        cell.textContent === '') {

                        game.interface.writeInTheCell(cell, game.getSymbols(0))

                        game.totalFilledCells++

                        game.checkTheWinner(game.getSymbols(0))

                        if (!game.getIsEndOfTheGame()) {

                            if (game.getTotalFilledCells() === game.getTotalCells()) {

                                game.setCurrentPlayer(null)

                            } else {

                                game.changeCurrentPlayer()

                                game.computerPlays()

                            }

                            game.interface.writeCurrentPlayerName()

                        }

                    }

                })

            })

            if (game.getCurrentPlayer() === game.getSymbols(1))
                game.computerPlays()

            game.interface.newGame.addEventListener('click', () => {
                game.newGame()
            })

        },

        newGame() {

            game.cleanTheBoard()

            game.setIsEndOfTheGame(false)

            game.setTotalFilledCells(0)

            game.setCurrentPlayer(game.generateRandomInteger(0, 1))

            game.interface.writeCurrentPlayerName()

            if (game.getCurrentPlayer() === game.getSymbols(1))            
                game.computerPlays()

        },

        // SETTERS
        setCurrentPlayer(index = null) {
            game.currentPlayer = (index !== null) ? game.getSymbols(index) : ''
        },

        setIsEndOfTheGame(bool) {
            game.isEndOfTheGame = bool
        },

        setTotalFilledCells(number) {
            game.totalFilledCells = number
        },

        // GETTERS
        getCurrentPlayer() {
            return game.currentPlayer
        },

        getIsEndOfTheGame() {
            return game.isEndOfTheGame
        },

        getSymbols(index) {
            return game.symbols[index]
        },

        getTotalCells() {
            return game.totalCells
        },

        getTotalFilledCells() {
            return game.totalFilledCells
        }

    }

    game.start()

})()