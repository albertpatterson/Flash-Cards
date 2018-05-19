import './css/app.css';
import './media/favicon.ico';

const view = require("./js/utils/view");
const actionAndNav = require("./js/utils/actionAndNav");
const dataService = require("./js/service/dataService");
const constants = require("./js/utils/constants");
const authFlow = require("./js/auth/authFlow");
const flashcards = require("./js/flashcards/flashcards");
const settingsFlow = require("./js/settings/settingsFlow");

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

let config = {
  apiKey: 'AIzaSyBXBROkk9uvCEuhxrRgcLir2Ia0w_Cpvjs',
  discoveryDocs: ["https://sheets.googleapis.com/$discovery/rest?version=v4",
                  "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"],
  clientId: '654884288051-tljp13krpkhd0vmv71arp2lrt2avc0br.apps.googleusercontent.com',
  scope: 'https://www.googleapis.com/auth/drive.metadata.readonly'
};

function onSignin(){
  return settingsFlow.start(settings)
  .then(function(){
    view.show("settings-btn");
    view.showExclusive("app-modal");
  });
}

function onSignout(){
  view.showExclusive("login-modal");
}

authFlow.init(config, onSignin, onSignout);

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