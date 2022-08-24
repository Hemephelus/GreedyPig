const setUpButton = document.querySelector('#setUp')
setUpButton.onclick = goToSetupPage
const generateAvatars = document.querySelector('#generate_avatars')
generateAvatars.onclick = generatePlayers
const playGame = document.querySelector('#play_game')
playGame.onclick = goToMainGame

// Used in page 1 (Welcome page)
function goToSetupPage() {
  const welcomeList = document.querySelector(".welcome").classList;
  const setupList = document.querySelector(".set_up_page").classList;
  welcomeList.add("hidden");
  setupList.remove("hidden");
}


// Used in page 2 (set-up-page)
function generatePlayers() {
  let gameLimit = renderInputError('gameLimit','ErrorInputLimit',11,Infinity,false)
  if (gameLimit === null)return

  let numberOfPlayers = renderInputError('numberOfPlayers','ErrorInputName',2,10,false)
  if (numberOfPlayers === null)return
  
  renderAvatars(numberOfPlayers)
  playGame.classList.add('animate-bounce')
}

// Used in page 2 (set-up-page)
function renderAvatars(numPlayers) {
  playerList = []
  const avatarSection = document.querySelector("#avatar_section");
  
  while (avatarSection.hasChildNodes()) {
    avatarSection.removeChild(avatarSection.firstChild);
  }

  for (let i = 0; i < numPlayers; i++) {

    let playerCardDiv = document.createElement('div')
    playerCardDiv.classList.add('player_card')

    let playerNumberDiv = document.createElement('div')
    playerNumberDiv.classList.add('player_number')
    playerNumberDiv.innerText = `Player ${i + 1}`

    let playerAvatarDiv = document.createElement('div')
    playerAvatarDiv.classList.add('player_avatar')
    playerAvatarDiv.innerHTML = `<img src="./images/avatar_${i + 1}.png" alt="" width="75">`

    let playerNameInput = document.createElement('input')
    playerNameInput.classList.add('player_name')
    playerNameInput.type = 'text'
    playerNameInput.placeholder = 'Enter Name'


    playerCardDiv.append(playerNumberDiv, playerAvatarDiv, playerNameInput)
    playerList.push(playerCardDiv)
  }

  avatarSection.append(...playerList)

}


//returns boolean to check for valid input
function IsValid(inputVal,minval,maxval,isAvatarSection) {

  if (inputVal === '') return false
  if (isAvatarSection)return true
  if (inputVal * 0 !== 0) return false
  if (inputVal < minval || inputVal > maxval) return false
  
  return true
}

// renders an error message and returns null if input is invalid, returns intiger if input is valid
function renderInputError(inputId,errorId,minVal,maxVal,isAvatarSection){
  const numberOfPlayersInput = document.querySelector(`#${inputId}`);
  let numberOfPlayers = numberOfPlayersInput.value

  if (!IsValid(numberOfPlayers,minVal,maxVal,isAvatarSection)) {
    const ErrorInputName = document.querySelector(`#${errorId}`).classList;
    ErrorInputName.remove("hidden")
    return null
  }
  
  const ErrorInputName = document.querySelector(`#${errorId}`).classList;
  ErrorInputName.add("hidden")
  
  return parseInt(numberOfPlayers)
  
}


//validates and starts the game game
function goToMainGame() {
  validatePlayers()

}

//Check if the player has a name.
function validatePlayers(){

}