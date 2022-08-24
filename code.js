const setUpButton = document.querySelector('#setUp')
setUpButton.onclick = goToSetupPage
const generateAvatars = document.querySelector('#generate_avatars')
generateAvatars.onclick = generatePlayers

function goToSetupPage(){
    const welcomeList = document.querySelector(".welcome").classList;
    const setupList = document.querySelector(".set_up_page").classList;
    welcomeList.add("hidden");
    setupList.remove("hidden");
  }
  
  function generatePlayers(){
  const numberOfPlayersInput = document.querySelector("#numberOfPlayers");
  
  let numberOfPlayers = numberOfPlayersInput.value
 
  numberOfPlayers = checkValue(numberOfPlayers)

  if(numberOfPlayers === null)return
  

  renderAvatars(numberOfPlayers)
  
}

function renderAvatars(numPlayers){
  playerList = []
  const avatarSection = document.querySelector("#avatar_section");
  while (avatarSection.hasChildNodes()) {
    avatarSection.removeChild(avatarSection.firstChild);
  }
  for(let i = 0; i< numPlayers; i++){

  let playerCardDiv = document.createElement('div')
  playerCardDiv.classList.add('player_card')

  let playerNumberDiv = document.createElement('div')
  playerNumberDiv.classList.add('player_number')
  playerNumberDiv.innerText = `Player ${i+1}`

  let playerAvatarDiv = document.createElement('div')
  playerAvatarDiv.classList.add('player_avatar')
  playerAvatarDiv.innerHTML = `<img src="./images/avatar_${i+1}.png" alt="" width="75">`

  let playerNameInput = document.createElement('input')
  playerNameInput.classList.add('player_name')
  playerNameInput.type = 'text'
  playerNameInput.placeholder = 'Enter Name'

  
  playerCardDiv.append(playerNumberDiv,playerAvatarDiv,playerNameInput)  
  playerList.push(playerCardDiv)
  }
  
  avatarSection.append(...playerList)

}

function checkValue(numberOfPlayers){
  
  if(numberOfPlayers*0 !== 0){
    const ErrorInput = document.querySelector("#ErrorInput").classList;
    ErrorInput.remove("hidden") 
    return null
  }else{
    const ErrorInput = document.querySelector("#ErrorInput").classList;
    ErrorInput.add("hidden")
    return numberOfPlayers*1
  }
}