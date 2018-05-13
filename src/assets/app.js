import './css/app.css';
import './media/favicon.ico';

const view = require("./js/utils/view");
const actionAndNav = require("./js/utils/actionAndNav");
const dataService = require("./js/service/dataService");
const constants = require("./js/utils/constants");

const authFlow = require("./js/auth/authFlow");
const flashcardsFlow = require("./js/flashcards/flashcardsFlow");
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

authFlow.init(config).then(showApp);

function showApp(){
  return settingsFlow.start(settings)
  .then(function(){
    view.show(document.getElementById("settings-btn"))
  });
}

settingsFlow.init(
  data,
  settings,
  ()=>{
    return dataService.getTerms(settings, data)
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
  let actionName = actionEl.dataset.action;
  let checkEl = actionEl.parentElement;
  while(checkEl && !checkEl.classList.contains("modal-content")) checkEl=checkEl.parentElement;
  if(checkEl){
    let errorWrapper = document.querySelector(`[data-error="${actionName}"]`);
    if(!errorWrapper) console.warn("No error wrapper found for action "+actionName);
    return errorWrapper;
  }else{
    console.error("No modal-content parent found for action "+actionName);
    return null;
  }
}

actionAndNav.init(view.showExclusive, showErrorReport, resetErrorReport);