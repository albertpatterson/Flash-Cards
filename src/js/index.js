const view = require("./utils/view");
const settingsFlow = require("./settings/settingsFlow");
const actionAndNav = require("./utils/actionAndNav");
const flashcardsFlow = require("./flashcards/flashcardsFlow");
const dataService = require("./service/dataService");
const constants = require("./utils/constants");


//     AIzaSyBdvR2QMz3NrYmv5LuNzTIEPkvUURQF6zU    


const data = {
  availableSets: [],
  activeCards: [],
  inactiveCards: []
}

const settings = {
  google: {
    apiKey: "",
    spreadsheetId: "",
  },
  setSelected: [],
  startWithChinese: false,
  provider: constants.google,
}

settingsFlow.init(
  data, 
  settings, 
  ()=>{
    console.log(data, settings); 
    let setsToGet = data.availableSets.filter((_, i)=>settings.setSelected[i]);
    return dataService.getTerms(settings, setsToGet)
    .then(terms=>{
      console.log(terms);
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
  console.log("reporting error", error)
  let errorWrapper = getErrorWrapper(el);
  if(errorWrapper){
    errorWrapper.innerText = error.message;
    view.show(errorWrapper)
  }
  return Promise.resolve(false);
}

function resetErrorReport(el){
  console.log("resetting error report")
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