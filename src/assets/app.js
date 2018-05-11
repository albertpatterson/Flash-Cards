import './css/app.css';
import '../../node_modules/firebaseui/dist/firebaseui.css';
import './media/favicon.ico';

const view = require("./js/utils/view");
const settingsFlow = require("./js/settings/settingsFlow");
const actionAndNav = require("./js/utils/actionAndNav");
const flashcardsFlow = require("./js/flashcards/flashcardsFlow");
const dataService = require("./js/service/dataService");
const constants = require("./js/utils/constants");

const firebase = require("firebase/app");
const firebaseui = require('firebaseui');

const config = {
  apiKey: "AIzaSyBzCyZsZxmVm4h148ZVMBK8arsDz9WLR84",
  authDomain: "flashcards-6c206.firebaseapp.com",
  databaseURL: "https://flashcards-6c206.firebaseio.com",
  projectId: "flashcards-6c206",
  storageBucket: "flashcards-6c206.appspot.com",
  messagingSenderId: "544287231306",
  clientId: '654884288051-tljp13krpkhd0vmv71arp2lrt2avc0br.apps.googleusercontent.com',
  scopes: ['https://www.googleapis.com/auth/drive'],
  discoveryDocs: ["https://sheets.googleapis.com/$discovery/rest?version=v4",
    "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"]
};
firebase.initializeApp(config);


// FirebaseUI config.
const uiConfig = {
  signInSuccessUrl: 'http://localhost:12003/', // todo: upate for deployment
  signInOptions: [
    // Leave the lines as is for the providers you want to offer your users.
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
  ],
  // Terms of service url.
  tosUrl: 'http://localhost:12003/' // todo: upate for deployment
};

// Initialize the FirebaseUI Widget using Firebase.
var ui = new firebaseui.auth.AuthUI(firebase.auth());
// The start method will wait until the DOM is loaded.
ui.start('#sign-in-container', uiConfig);

let initApp = function() {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // user.getIdToken().then(function(accessToken) {
      load_gapi().then(function(){
        document.getElementById("app-modal").classList.add("showing");
        document.getElementById("login-modal").classList.remove("showing");
        document.getElementById("loading-modal").classList.remove("showing");
      });
      // });
    } else {

      document.getElementById("login-modal").classList.add("showing");
      document.getElementById("app-modal").classList.remove("showing");
      document.getElementById("loading-modal").classList.remove("showing");

      ["firebaseui-idp-icon", "firebaseui-idp-text"].forEach( c=> {
        [].forEach.call(document.getElementsByClassName(c), e=>{
          e.classList.add(c+"-nice");
        })
      });
    }
  }, function(error) {
    console.log(error);
  });
};

window.addEventListener('load', function() {
    initApp()
});

function load_gapi(){
  return new Promise((res, rej)=>{
    const s = document.createElement("script");
    s.src = "https://apis.google.com/js/api.js";
    s.onload = function(){this.onload=function(){}; handle_gapi_load(res)};
    s.onreadystatechange = function(){if (this.readyState === 'complete') this.onload()};
    document.head.appendChild(s);
  })
}

function handle_gapi_load(res) {
  gapi.load('client:auth2', function() {
    gapi.client.init({
      apiKey: config.apiKey,
      clientId: config.clientID,
      discoveryDocs: config.discoveryDocs,
      scope: config.scopes.join(' '),
    }).then(res);
  })
}













const data = {
  availableSets: [],
  activeCards: [],
  inactiveCards: []
};

const settings = {
  google: {
    spreadsheetId: "",
  },
  setSelected: [],
  startWithChinese: false,
  provider: constants.google,
};

settingsFlow.init(
  data,
  settings,
  ()=>{
    let setsToGet = data.availableSets.filter((_, i)=>settings.setSelected[i]);
    return dataService.getTerms(settings, setsToGet)
    .then(terms=>{
      flashcardsFlow.start(terms);
      view.showExclusive('flash-card');
    });
  },
  ()=>{
    flashcardsFlow.start();
    return Promise.resolve(true);
  });

flashcardsFlow.init(data, settings, ()=>view.showExclusive('complete'));


function showErrorReport(error, el){
  let errorWrapper = getErrorWrapper(el);
  if(errorWrapper){
    errorWrapper.innerText = error.message;
    view.show(errorWrapper)
  }
  return Promise.resolve(false);
}

function resetErrorReport(el){
  let errorWrapper = getErrorWrapper(el);
  if(errorWrapper){
    errorWrapper.innerText = "";
    view.unshow(errorWrapper)
  }
  return Promise.resolve(true);
}

function getErrorWrapper(actionEl){
  let checkEl = actionEl.parentElement;
  while(checkEl && !checkEl.classList.contains("modal-content")) checkEl=checkEl.parentElement;
  if(checkEl){
    let actionName = actionEl.dataset.action
    let errorWrapper = document.querySelector(`[data-error="${actionName}"]`);
    if(!errorWrapper) console.warn("No error wrapper found for action "+actionName);
    return errorWrapper;
  }else{
    console.error("No modal-content parent found for action "+actionName);
    return null;
  }
}

actionAndNav.init(view.showExclusive, showErrorReport, resetErrorReport);