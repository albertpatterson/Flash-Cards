import './scss/app.scss';
import './media/settings.png'


const view = require("./js/utils/view");
const dataService = require("./js/service/dataService");
const constants = require("./js/utils/constants");
const authFlow = require("./js/auth/authFlow");
const flashcards = require("./js/flashcards/flashcards");
const settingsFlow = require("./js/settings/settingsFlow");

// set fontsize based on device size
document.querySelector('html').style.fontSize=document.body.style.fontSize=screen.availHeight*devicePixelRatio*.015+"px";

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

function onSignin(){
  return settingsFlow.start(settings)
  .then(function(){
    view.show("settings-btn");
    view.showExclusive("app-modal");
  })
}

function onSignout(){
  view.showExclusive("login-modal");
}

authFlow.init(onSignin, onSignout);

settingsFlow.init(
  data,
  settings,
  ()=>{
    return dataService.getTerms(settings, data)
    .then(terms=>{
      flashcards.start(settings, terms);
      view.showExclusive('flash-card');
    });
  },
  ()=>{
    flashcards.skip();
    return Promise.resolve(true);
  });