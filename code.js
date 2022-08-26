const avatarSection = document.querySelector("#avatar_section");
const setUpButton = document.querySelector('#setUp')
setUpButton.onclick = goToSetupPage
const playGame = document.querySelector('#play_game')
playGame.onclick = goToMainGame
const howToPlay = document.querySelector('#how_to_play')
howToPlay.onclick = goToHowTOplay
const BackToSetupPageBtn = document.querySelector('#howToPlay_to_setUp')
BackToSetupPageBtn.onclick = BackToSetupPage
const diceFace = document.querySelector('#dice-face')
diceFace.onclick = rollDie
const diceFaceImg = document.querySelector('#dice-face')
const playerTurnAvatar = document.querySelector('#player_turn_avatar')
const gameLimitBox = document.querySelector('.limit_num h1')
const playerNumBox = document.querySelector('.players_num h1')
const passDiceBtn = document.querySelector('#pass_dice')
passDiceBtn.onclick = passDice

let game = null
const pages = ['#welcome', '#setup', '#game', '#how-to']
let players = {}

// List of available avatar URLs
const avatars = [
  '/images/avatars/avatar_1.png',
  '/images/avatars/avatar_2.png',
  '/images/avatars/avatar_3.png',
  '/images/avatars/avatar_4.png',
  '/images/avatars/avatar_5.png',
  '/images/avatars/avatar_6.png',
  '/images/avatars/avatar_7.png',
  '/images/avatars/avatar_8.png',
]

// Generate unique IDs
function generateId () {
  return (Math.random() * 1000000 + Date.now()).toString(16).replace('.', '-')
}

// Used in page 1 (Welcome page)
function goToSetupPage() {
  navigateTo('#setup')
}

function BackToSetupPage() {
  history.go(-1)
}

// Function to swap pages
function handleNavigation (hash) {
  pages.forEach(pageHashID => {
    let page = document.querySelector(pageHashID)
    if (!page.classList.contains('hidden')) {
      page.classList.add('hidden')
    }
  })

  if (!hash) {
    document.querySelector('#welcome').classList.remove('hidden')
    return
  }
  
  document.querySelector(hash).classList.remove('hidden')
}

// Function to change page url location
function navigateTo (hash) {
  if (hash === '#welcome') {
    return
  }

  history.pushState({pageID: hash.slice(1)}, hash.slice(0, 1).toUpperCase() + hash.slice(1), hash);

  handleNavigation(hash)
}

// Used in page 2 (set-up-page)
function generatePlayers() {
  let gameLimit = renderInputError('#gameLimit', '#ErrorInputLimit', 11, Infinity, false,document)
  if (gameLimit === null) return

  let numberOfPlayers = renderInputError('#numberOfPlayers', '#ErrorInputName', 2, 10, false,document)
  if (numberOfPlayers === null) return

  players = createPlayers()

  avatarSection.innerHTML = ''
  // Show generated placeholder players
  renderAvatars(Object.values(players))

  // generateAvatars.classList.remove('animate-bounce') 
  playGame.classList.add('animate-bounce')
}

document.querySelector('#numberOfPlayers').oninput = generatePlayers

// Used in page 2 (set-up-page)
function renderAvatars(players) {
  // numPlayers = parseInt(numPlayers)
  playerList = []

  while (avatarSection.hasChildNodes()) {
    avatarSection.removeChild(avatarSection.firstChild);
  }

  for (let i = 0; i < players.length; i++) {

    let playerCardDiv = document.createElement('div')
    playerCardDiv.classList.add('player_card')
    playerCardDiv.id = players[i].id

    let playerNumberDiv = document.createElement('div')
    playerNumberDiv.classList.add('player_number')
    playerNumberDiv.innerText = `Player ${i + 1}`

    let playerAvatarDiv = document.createElement('div')
    playerAvatarDiv.classList.add('player_avatar')
    playerAvatarDiv.innerHTML = `<img src=".${players[i].avatar}" alt="" width="75">`
    
    let playerNameInput = document.createElement('input')
    playerNameInput.classList.add('player_name')
    playerNameInput.type = 'text'
    playerNameInput.placeholder = 'Enter Name'
    playerNameInput.oninput = (evt) => {
      let id = players[i].id
      console.log(id)
      modifyPlayer(id, { name: evt.target.value })
    }


    playerCardDiv.append(playerNumberDiv, playerAvatarDiv, playerNameInput)
    avatarSection.append(playerCardDiv)
  }

  // avatarSection.append(...playerList)
}

function modifyPlayer (id, modifications) {
  players[id] = { ...players[id], ...modifications }
}

//returns boolean to check for valid input
function IsValid(inputVal, minval, maxval, isAvatarSection) {

  if (inputVal === '') return false
  if (isAvatarSection) return true
  if (inputVal * 0 !== 0) return false
  if (inputVal < minval || inputVal > maxval) return false

  return true
}

// renders an error message and returns null if input is invalid, returns integer if input is valid
function renderInputError(inputId, errorId, minVal, maxVal, isAvatarSection,currentDiv) {
  const getInputById = currentDiv.querySelector(`${inputId}`);
  let inputValue = getInputById.value

  if (!IsValid(inputValue, minVal, maxVal, isAvatarSection)) {
    const ErrorInputName = document.querySelector(`${errorId}`).classList;
    ErrorInputName.remove("hidden")
    return null
  }

  const ErrorInputName = document.querySelector(`${errorId}`).classList;
  ErrorInputName.add("hidden")

  return inputValue

}

function createPlayers () {
  const noOfPlayers = document.querySelector('#numberOfPlayers').value
  const newPlayers = {}
  let tempAvatars = [...avatars]
  for (let index = 0; index < noOfPlayers; index++) {
      let id = generateId()
      let avatar = tempAvatars.splice(Math.floor(Math.random() * tempAvatars.length), 1)[0]

      let player = { id, avatar, name: '', score: 0, runningScore: 0, }

      newPlayers[id] = player
  }

  return newPlayers
}

//validates the inputs and starts the game
function goToMainGame() {
  const listOfPlayers = document.querySelectorAll('.player_card')
  let playerNames =[]
  let gameLimit = renderInputError('#gameLimit', '#ErrorInputLimit', 11, Infinity, false,document)
  if (gameLimit === null) return
  let numberOfPlayers = renderInputError('#numberOfPlayers', '#ErrorInputName', 2, 10, false,document)
  if (numberOfPlayers === null) return
  if(listOfPlayers.length === 0){ generateAvatars.classList.add('animate-bounce'); return}

  for(let player = 0; player < listOfPlayers.length; player++){
    let playerName = renderInputError('input', '#ErrorInputPlayerName', 2, 10, true,listOfPlayers[player])
    if (playerName === null)return
  }

  // Create a Greedy Pig Instance
  game = new GreedyPig(
    document.querySelector('#gameLimit').value,
    document.querySelector('#numberOfPlayers').value,
    players
  )

  game.start()
  setupGameScreen()
  showWhoseTurn()
  navigateTo('#game')
  saveGameState()
}

// Function to show whose turn it is to play
function showWhoseTurn () {
  generatePlayersList()

  let currentPlayer = game.getPlayer(game.currentPlayerId)

  playerTurnAvatar.innerHTML = `
    <img src=".${currentPlayer.avatar}" alt="" width="100">
    <p class="text-lg font-medium">${currentPlayer.name}</p>
  `
}

// Function to Generate Players List
function generatePlayersList () {
  let playerCards = game.getPlayers().map(player => {
    return `
      <div class="${player.id === game.currentPlayerId ? 'active-card' : 'inactive-card'}">
        <figure class="font-semibold text-[20px] flex-1 w-[50px]">
          <img src=".${player.avatar}" alt="" width="40">
        </figure>
        <h2 class="font-semibold text-[20px] flex-1">${player.name}</h2>
        <p class="font-semibold text-[20px] flex-1">${player.score}</p>
        <p class="font-semibold text-[20px] flex-1">${player.runningScore}</p>
      </div>
    `
  })

  document.querySelector('.body_cards').innerHTML = playerCards.join('')
}

// Function to prefill the game screen with current information
function setupGameScreen () {
  gameLimitBox.textContent = game.gameLimit
  playerNumBox.textContent = game.noOfPlayers
}

// Function to pass the dice to next player
function passDice () {
  // Add running score to player score
  let playerId = game.currentPlayerId
  let player = game.getPlayer(playerId)
  game.modifyPlayer(playerId, {
    score: player.score + player.runningScore,
    runningScore: 0
  })

  // Move to the next player
  game.nextTurn()
  showWhoseTurn()
  saveGameState()
}

// Function to navigate to the #how-to page
function goToHowTOplay(){
  navigateTo('#how-to')
}

// Function to update user running score after dice roll
function handleUserScore (diceRoll) {
  // Handle User score increment/reset and pass dice to other players
  let playerId = game.currentPlayerId
  let player = game.getPlayer(playerId)

  if (diceRoll === 1) {
    // Reset Running Score
    game.modifyPlayer(playerId, {
      runningScore: 0
    })

    // Pass Dice
    passDice()
  } else {
    // Add Dice roll count to running score
    game.modifyPlayer(playerId, {
      runningScore: player.runningScore + diceRoll
    })
  }

  showWhoseTurn()
} 

// Function to roll the dice
function rollDie(){
  let endRoll = 0
  let interval, r
 
  interval = setInterval(() => {
    if(endRoll <= 30){
        r = Math.floor((Math.random()*6)+1)
        endRoll++
        renderDice(r)  
    } else {
      diceFaceImg.innerHTML =`<img class="cursor-pointer hover:scale-105 active:scale-100" src="./images/dice_faces/dice_face_${r}.svg" alt="">`
      clearInterval(interval)

      handleUserScore(r)
      saveGameState()
    }
  
    return
  } , 100)
}

// Function to save game state
function saveGameState () {
  localStorage.setItem('game-state', JSON.stringify({
    gameLimit: game.gameLimit,
    noOfPlayers: game.noOfPlayers,
    currentPlayerId: game.currentPlayerId,
    players: game.players,
  }))
}

// Function to render dice faces
function renderDice(r){
  diceFaceImg.innerHTML = diceFaceImg.innerHTML+`<img class="cursor-pointer absolute" src="./images/dice_faces/dice_face_${r}.svg" alt="">`

  let diceNumber = document.querySelector('#dice_number')
  diceNumber.innerHTML = r
}

window.addEventListener('load', function (event) {
  handleNavigation(location.hash)

  if (location.hash === '#game') {
    let prevGameState = JSON.parse(localStorage.getItem('game-state'))
    game = new GreedyPig(prevGameState.gameLimit, prevGameState.noOfPlayers, true)
    game.setPlayers(prevGameState.players)
    game.currentPlayerId = prevGameState.currentPlayerId
    showWhoseTurn()
    setupGameScreen()
  } else {
    localStorage.removeItem('game-state')
  }
});

window.addEventListener('popstate', function (event) {
  handleNavigation(location.hash)
});