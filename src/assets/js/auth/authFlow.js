const googleAuth = require("./googleAuth");
const firebaseAuth = require("./firebaseAuth");
const actionAndNav = require("../utils/actionAndNav");

let onSignin = null;
let onSignout = null;

let onSigninRes = null;
let onSigninRej = null;
let onSignoutRes = null;
let onSignoutRej = null;
const actions ={
  "sign-in": function(){
    return new Promise((res, rej)=>{
      onSigninRes = res;
      onSigninRej = rej;
      signin();
    })
  },
  "sign-out": function(){
    return new Promise((res, rej)=>{
      onSignoutRes = res;
      onSignoutRej = rej;
      signout();
    })
  },
};
actionAndNav.addActions(actions);

function signin(){
  googleAuth.signIn()
  .catch(onSigninRej);
}

function signout(){
  googleAuth.signOut()
  .catch(onSignoutRej);
}

function onGoogleStatusUpdate(googleUser){
  if(googleUser) {
    firebaseAuth.signInGoogleUser(googleUser)
    .then(onSignin)
    .then(onSigninRes)
    .catch(onSigninRej)
  }else{
    firebaseAuth.signout()
    .then(onSignout)
    .then(onSignoutRes)
    .catch(onSignoutRej)
  }
}

function init(_onSignin, _onSignout){
  onSignin = _onSignin;
  onSignout = _onSignout;
  return googleAuth.init(onGoogleStatusUpdate);
}

module.exports = {
  init,
  refresh: firebaseAuth.refresh
};