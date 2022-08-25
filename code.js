const setUpButton = document.querySelector('#setUp')
setUpButton.onclick = goToSetupPage
const generateAvatars = document.querySelector('#generate_avatars')
generateAvatars.onclick = generatePlayers
const playGame = document.querySelector('#play_game')
playGame.onclick = goToMainGame
const howToPlay = document.querySelector('#how_to_play')
howToPlay.onclick = goToHowTOplay
const BackToSetupPageBtn = document.querySelector('#howToPlay_to_setUp')
BackToSetupPageBtn.onclick = BackToSetupPage
const diceFace = document.querySelector('#dice-face')
diceFace.onclick = rollDie
const diceFaceImg = document.querySelector('#dice-face')

let game = null
const pages = ['#welcome', '#setup', '#game', '#how-to']

// Used in page 1 (Welcome page)
function goToSetupPage() {
  // changePage(".welcome",".set_up_page")
  navigateTo('#setup')
}

function BackToSetupPage() {
  // changePage(".how_to_play",".set_up_page")
  history.go(-1)
}

function changePage(currentPage,nextPage) {
  const currentPageClass = document.querySelector(`${currentPage}`).classList;
  const nextPageClass = document.querySelector(`${nextPage}`).classList;
  currentPageClass.add("hidden");
  nextPageClass.remove("hidden");
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

  game = new GreedyPig(
    document.querySelector('#gameLimit').value,
    document.querySelector('#numberOfPlayers').value,
  )
  renderAvatars(game.getPlayers())
  generateAvatars.classList.remove('animate-bounce') 
  playGame.classList.add('animate-bounce')
}

// Used in page 2 (set-up-page)
function renderAvatars(players) {
  // numPlayers = parseInt(numPlayers)
  playerList = []
  const avatarSection = document.querySelector("#avatar_section");

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
    playerAvatarDiv.innerHTML = `<img src="${location.origin+players[i].avatar}" alt="" width="75">`
    
    let playerNameInput = document.createElement('input')
    playerNameInput.classList.add('player_name')
    playerNameInput.type = 'text'
    playerNameInput.placeholder = 'Enter Name'
    playerNameInput.oninput = (evt) => {
      let id = players[i].id
      console.log(id)
      game.modifyPlayer(id, { name: evt.target.value })
    }


    playerCardDiv.append(playerNumberDiv, playerAvatarDiv, playerNameInput)
    playerList.push(playerCardDiv)
  }

  avatarSection.append(...playerList)

}


//returns boolean to check for valid input
function IsValid(inputVal, minval, maxval, isAvatarSection) {

  if (inputVal === '') return false
  if (isAvatarSection) return true
  if (inputVal * 0 !== 0) return false
  if (inputVal < minval || inputVal > maxval) return false

  return true
}

// renders an error message and returns null if input is invalid, returns intiger if input is valid
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


//validates the inputs and starts the  game
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

  // changePage(".set_up_page",".main_game")
  navigateTo('#game')
}

function goToHowTOplay(){
  // changePage(".set_up_page",".how_to_play")
  navigateTo('#how-to')
}

function rollDie(){
  let endRoll = 0
  let interval,r
 
      interval = setInterval(() => {
          if(endRoll <= 30){
              r = Math.floor((Math.random()*6)+1)
              endRoll++
renderDice(r)  
              
          }else{
            diceFaceImg.innerHTML =`<img class="cursor-pointer hover:scale-105 active:scale-100" src="./images/dice_faces/dice_face_${r}.svg" alt="">`
      clearInterval(interval)}
      return
      } , 100)
}


function renderDice(r){
  diceFaceImg.innerHTML = diceFaceImg.innerHTML+`<img class="cursor-pointer hover:scale-105 active:scale-100 absolute" src="./images/dice_faces/dice_face_${r}.svg" alt="">`

  let diceNumber = document.querySelector('#dice_number')
  diceNumber.innerHTML = r
}

window.addEventListener('load', function (event) {
	// Log the state data to the console
  handleNavigation(location.hash)
});

window.addEventListener('popstate', function (event) {
	// Log the state data to the console
  handleNavigation(location.hash)
});