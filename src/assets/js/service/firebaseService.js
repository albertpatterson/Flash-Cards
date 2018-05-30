const firebase = require("firebase/app");
import "firebase/database";
import "firebase/auth"

function showFirebaseData(){
  return new Promise((res, rej)=> {
    firebase.database().ref("visitor").once("value").then(snapshot => {
      console.log(snapshot.child("message").val());
      res();
    }).catch(rej);
  })
}

const insertRecentsUrlPrefix = "https://us-central1-flashcards-6c206.cloudfunctions.net/app/recents?item=";
function insertRecent(spreadsheet){
  return new Promise((res, rej)=>{
    firebase.auth().currentUser.getIdToken()
      .then(id_token=>{
        const url = insertRecentsUrlPrefix+JSON.stringify(spreadsheet);
        fetch(url, {headers:{Authorization: "Bearer "+id_token}})
        .then(res)
        .catch(rej)
      })
  })
}

function getRecents(){
    const uid = firebase.auth().currentUser.uid;
    return firebase.database().ref(`recents/${uid}`).orderByKey().once("value")
    .then(snapshot => snapshot.val())
    .then(recents=>{
      const recentsRev = [];
      for(let key in recents){
        recentsRev.push(JSON.parse(recents[key]));
      }
      return recentsRev.reverse();
    })
}

module.exports = {
  showFirebaseData,
  insertRecent,
  getRecents
};