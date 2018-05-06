const utils = require("./utils");
const settingsFlow = require("./settingsFlow");
const actionAndNav = require("./actionAndNav");
const flashcardsFlow = require("./flashcardsFlow");
const dataService = require("./dataService");
const constants = require("./constants");


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
      utils.showExclusive('flash-card');
    });
  },
  ()=>{
    flashcardsFlow.start(); 
    return Promise.resolve(true);
  });

flashcardsFlow.init(data, settings, ()=>utils.showExclusive('complete'));


function showErrorReport(error, el){
  console.log("reporting error", error)
  let errorWrapper = getErrorWrapper(el);
  if(errorWrapper){
    errorWrapper.innerText = error.message;
    utils.show(errorWrapper)
  }
  return Promise.resolve(false);
}

function resetErrorReport(el){
  console.log("resetting error report")
  let errorWrapper = getErrorWrapper(el);
  if(errorWrapper){
    errorWrapper.innerText = "";
    utils.unshow(errorWrapper)
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

actionAndNav.init(utils.showExclusive, showErrorReport, resetErrorReport);

// init info links
// init spreadsheet id link
// let sheetIDBtn = document.getElementById("spreadsheet-info");
// sheetIDBtn.classList.add("info-btn");
// sheetIDBtn.target="_blank";
// sheetIDBtn.href="https://developers.google.com/sheets/api/guides/concepts#sheet_id";

// let apiKeyBtn = document.getElementById("api-key-info");
// apiKeyBtn.classList.add("info-btn");
// apiKeyBtn.target="_blank";
// apiKeyBtn.href="https://developers.google.com/sheets/api/guides/authorizing#APIKey";

// let settingsBtn = document.getElementById("settings-btn");
// settingsBtn.onclick = ()=>showExclusive('settings-panel');

// function showExclusive(id){
//   let showingContents = document.getElementsByClassName("modal-content");
//   [].forEach.call(showingContents, e=>e.classList.remove("showing"));
//   document.getElementById(id).classList.add("showing");
// }

// function setAction(type, action){
//   let initiators = document.querySelectorAll(`button[data-action="${type}"]`);
//   [].forEach.call(initiators, initiator => initiator.onclick=action);
// }

// setAction("use-alberts-list", function(){
//   sheetId = albertsSheetId;
//   showExclusive("choose-key");
// })

// setAction("go-to-choose-spreadsheet", function(){
//   showExclusive("choose-spreadsheet");
// })

// setAction("use-alberts-list", function(){
//   sheetId = albertsSheetId;
//   showExclusive("choose-key");
// })

// setAction("go-to-choose-list", function(){
//   showExclusive("choose-list");
// })

// setAction("go-back-from-choose-api-key", function(){
//   if(sheetId===albertsSheetId){
//     showExclusive("choose-list");
//   }else{
//     showExclusive("choose-spreadsheet");
//   }
// })

// setAction("set-api-key", function(){
//   let keyVal = document.getElementById("api-key").value;
//   apiKey=keyVal;
//   getData().then((data)=>startFlashCards(data));
// })

// setAction("set-spreadsheet-id", function(){
//   let idVal = document.getElementById("spreadsheet-id").value;
//   sheetId=idVal;
//   showExclusive("choose-key");
// })

// const actions = {
//   "use-alberts-list": function(){
//     settings.spreadsheetId = albertsSheetId;
//     document.getElementById("spreadsheet-id").value = settings.spreadsheetId; 
//     return Promise.resolve();
//   },
//   "set-api-key": function(){
//     settings.apiKey = document.getElementById("api-key").value;
//     // TODO validate key in some way
//     return Promise.resolve();
//   },
//   "set-spreadsheet-id": function(){
//     settings.spreadsheetId = document.getElementById("spreadsheet-id").value;
//     // send request for sheet names
//     data.availableSets = ["Sheet1", "Sheet2", "Sheet3"];
//     initSelectedSheetTitles();
//     initChooseSheets();
//     return Promise.resolve()
//   },
//   "set-sheets": function(){
//     data.availableSets.forEach((t, i)=>{
//       settings.setSelected[i]=document.getElementById(getSheetCheckboxId(t, i)).checked;
//     })
//     return Promise.resolve();
//   }
// }
// actionAndNav(actions, utils.showExclusive)

// function initSelectedSheetTitles(){
//   settings.setSelected = data.availableSets.map(()=>false);
// }

// function initChooseSheets(){
//   let contId = "sheet-check-cont";
//   let listCont = document.getElementById(contId);
//   let checkboxes = listCont.querySelector(".sheet-checkbox") || [];
//   [].forEach.call(checkboxes, checkbox=>{
//     listCont.removeChild(checkbox);
//   })
//   data.availableSets.forEach((sheetTitle, idx)=>{
//     let cont = document.createElement("div");
//     cont.classList.add("sheet-checkbox");
//     listCont.appendChild(cont);

//     let id = getSheetCheckboxId(sheetTitle, idx);
//     let cb = document.createElement("input");
//     cb.type="checkbox"
//     cb.id=id;
//     cont.appendChild(cb)

//     let lab = document.createElement("label");
//     lab.for=id;
//     lab.innerText=sheetTitle;
//     cont.appendChild(lab);
//   })
// }

// function getSheetCheckboxId(title, idx){
//   return `sheet-checkbox-${title}-${idx}`;
// }










// let navEls = document.querySelectorAll("[data-nav], [data-action]");
// [].forEach.call(navEls, navEl=>{
//   let actionName=navEl.dataset.action;
//   let nextId=navEl.dataset.nav
//   if(actionName && nextId){
//     navEl.onclick=()=>actions[actionName]().then(()=>showExclusive(nextId));
//   }else if(actionName){
//     navEl.onclick=actions[actionName];
//   }else{
//     navEl.onclick=()=>showExclusive(nextId);
//   }
// })
























// function getData(){
//   return Promise.resolve([{characters: "char", pinyin: "pinyin", english: "english"}]);
// }

// function startFlashCards(data){
//   initCardData(data);
//   showNextCard();
//   showExclusive("flash-card")
// }

// let availableCards=[];
// let hiddenCards=[];
// let currentCard;
// let flipped = false;

// function initCardData(data){
//   data.forEach(item=>item.hideTill=Date.now());
//   availableCards = data;
//   shuffle(availableCards);
// }

// function shuffle(a) {
//   for (let i = a.length - 1; i > 0; i--) {
//       const j = Math.floor(Math.random() * (i + 1));
//       [a[i], a[j]] = [a[j], a[i]];
//   }
// }

// function showNextCard(){
//   if(availableCards.length==0){
//     for(let i=0; i<hiddenCards.length; i++){
//       let card = hiddenCards[i];
//       if(card.hideTill<Date.now()){
//         availableCards.push(card);
//         hiddenCards.splice(i,1);
//       }
//     }
//     shuffle(availableCards);
//   }

//   if(availableCards.length===0){
//     showAllComplete();
//   }else{
//     currentCard = availableCards.pop();
//     hiddenCards.push(currentCard);
//     showCard();
//   }
// }

// let flashCardChar = document.getElementById("characters");
// let flashCardPinyin = document.getElementById("pinyin");
// let flashCardEng = document.getElementById("english");
// function showCard(){
//   flashCardChar.innerText = currentCard.characters;
//   flashCardPinyin.innerText = currentCard.pinyin;
//   flashCardEng.innerText = currentCard.english;

//   flipped=false;
//   showFrontSide();
//   showExclusive("flash-card");
// }



// let chineseSide = document.getElementById("chinese-side");
// let englishSide = document.getElementById("english-side");
// let flipBtn = document.getElementById("flip-button");
// flipBtn.onclick = flip;
// let hideForSection = document.getElementById("hide-for-section");
// function showFrontSide(){
//   if(startWithChinese){
//     chineseSide.classList.toggle('showing', true);
//     englishSide.classList.toggle('showing', false);
//   }else{
//     englishSide.classList.toggle('showing', true);
//     chineseSide.classList.toggle('showing', false);
//   }
//   hideForSection.classList.toggle('showing', false);
// }

// function flip(){
//   flipped=true;
//   chineseSide.classList.toggle('showing');
//   englishSide.classList.toggle('showing');
//   hideForSection.classList.toggle('showing', true);
// }

// const MIN_MILIS = 60*60*1000;
// const HOUR_MILIS = 60*MIN_MILIS;
// const DAY_MILIS = 24*HOUR_MILIS;
// setAction("delay-one-min", delayAndShowNext(MIN_MILIS));
// setAction("delay-ten-min", delayAndShowNext(10*MIN_MILIS));
// setAction("delay-one-hour", delayAndShowNext(HOUR_MILIS));
// setAction("delay-one-day", delayAndShowNext(DAY_MILIS));

// function delayAndShowNext(milis){
//   return function(){
//     currentCard.hideTill = Date.now()+milis;
//     showNextCard();
//   }
// }


// function showAllComplete(){
//   showExclusive('complete');
// }

// document.getElementById("reset-btn").onclick = function(){
//   initCardData(hiddenCards);
//   hiddenCards = [];
//   showNextCard();
// };

// let frontSideLangSelect = document.getElementById("front-side-lang-select");
// function updateSettings(){
//   startWithChinese = frontSideLangSelect.value==="Chinese";
//   showFrontSide();
//   showExclusive("flash-card");
//   if(flipped) flip();
// }
// setAction("update-settings", updateSettings);