const auth = require("./google");
const actionAndNav = require("../utils/actionAndNav");

let actions ={
  "sign-in": function(){
    auth.signIn();
    return Promise.resolve(true);
  },
  "sign-out": function(){
    auth.signOut();
    return Promise.resolve(true);
  },
};
actionAndNav.addActions(actions)


const loadingModal = document.getElementById("loading-modal");
const signInModal = document.getElementById("login-modal");
const appModal = document.getElementById("app-modal");
function showViewForAuth(isSignedIn){
  loadingModal.classList.remove("showing");
  if(isSignedIn){   
    signInModal.classList.remove("showing");
    appModal.classList.add("showing");
  }else{
    appModal.classList.remove("showing");
    signInModal.classList.add("showing");
  }
}

function init(config){
  return auth.init(config, showViewForAuth).then(showViewForAuth);
}

module.exports = {
  init
}