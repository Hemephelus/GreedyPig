class GreedyPig {
    players = {}
    avatars = [
        '/images/avatars/avatar_1.png',
        '/images/avatars/avatar_2.png',
        '/images/avatars/avatar_3.png',
        '/images/avatars/avatar_4.png',
        '/images/avatars/avatar_5.png',
        '/images/avatars/avatar_6.png',
        '/images/avatars/avatar_7.png',
        '/images/avatars/avatar_8.png',
    ]

    currentPlayerId = null

    constructor (gameLimit, noOfPlayers) {
        this.gameLimit = gameLimit
        this.noOfPlayers = noOfPlayers
        this.createPlayers(noOfPlayers)
    }

    checkGameOver () {
        return Object.values(this.players).some(player => player.score >= this.gameLimit)
    }

    getPlayers () {
        return Object.values(this.players)
    }

    getPlayersHashMap () {
        return this.players
    }

    getPlayer (id) {
        return this.players[id]
    }

    generateId () {
        return (Math.random() * 1000000 + Date.now()).toString(16).replace('.', '-')
    }

    createPlayers (noOfPlayers) {
        for (let index = 0; index < noOfPlayers; index++) {
            let id = this.generateId()
            let player = {
                id,
                avatar: this.avatars[Math.floor(Math.random() * this.avatars.length)],
                name: '',
                score: 0,
                runningScore: 0,
            }

            this.players[id] = player
        }

        this.saveToLocalStorage('players', this.players)
    }
    
    modifyPlayer (id, modifications) {
        this.players[id] = {
            ...this.players[id],
            ...modifications
        }
        
        this.saveToLocalStorage('players', this.players)
    }
    
    start () {
        this.currentPlayerId = Object.keys(this.players)[0]
    }

    nextTurn () {      
        let ids = Object.keys(this.players)
        this.currentPlayerId = ids[ids.indexOf(this.currentPlayerId) + 1] ? ids[ids.indexOf(this.currentPlayerId) + 1] : ids[0]
    }

    saveToLocalStorage (key, obj) {
        if (localStorage[key]) localStorage.removeItem(key)

        localStorage.setItem(key, JSON.stringify(obj))
    }

    readFromLocalStorage (key) {
        return JSON.parse(localStorage.getItem(key))
    }
}