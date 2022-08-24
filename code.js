const setUpButton = document.querySelector('#setUp')
setUpButton.onclick = goToSetupPage

function goToSetupPage(){
    const welcomeList = document.querySelector(".welcome").classList;
    const setupList = document.querySelector(".set_up_page").classList;
    welcomeList.add("hidden");
  setupList.remove("hidden");
}