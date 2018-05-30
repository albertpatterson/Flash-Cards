const firebase = require("firebase/app");
import "firebase/auth";
import 'firebase/database';

const firebaseConfig  = require("../config/firebaseConfig");
firebase.initializeApp(firebaseConfig);

let googleUser = null;

function signInGoogleUser(_googleUser){

  if(!_googleUser) throw new Error("no valid googleUser provided");

  googleUser = _googleUser;

  return new Promise((res, rej)=>{
    const idToken = googleUser.getAuthResponse().id_token;
    const googleCredential = firebase.auth.GoogleAuthProvider.credential(idToken);
    firebase.auth().signInAndRetrieveDataWithCredential(googleCredential)
    .then(firebaseCredential => {
      if (firebaseCredential) {
        res(firebaseCredential);
      }else{
        rej("no firebase credential.")
      }
    })
    .catch(rej);
  });
}

function refresh(){
  return signInGoogleUser(googleUser);
}

function signout(){
  return firebase.auth().signOut();
}

module.exports = {
  signInGoogleUser,
  signout,
  refresh
};