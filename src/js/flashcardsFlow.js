const actionAndNav = require("./actionAndNav");
const constants = require("./constants");
const utils = require("./utils");


let data = null;
let settings = null;
let onComplete = null;
let currentCard;
let flipped = false;

let flashcardsFlow = {
  init: function(_data, _settings, _onComplete){
    data=_data;
    settings=_settings;
    onComplete=_onComplete;
  },
  start: function(terms){
    if(terms){
      startFlashCards(terms);
    }else if(data.activeCards.length===0){
      data.activeCards.push(...data.inactiveCards);
      data.inactiveCards = [];
      startFlashCards(data.activeCards);
    }else{
      console.log("start", data.activeCards, data.inactiveCards, Date.now());  
      startFlashCards(data.activeCards);
    }
  }
};

let actions ={
  "flip": function(){
    flip();
    return Promise.resolve();
  },
  "delay-one-min": hideAndShowNext(constants.minMilis),
  "delay-ten-min": hideAndShowNext(10*constants.minMilis),
  "delay-one-hour": hideAndShowNext(constants.hourMilis),
  "delay-one-day": hideAndShowNext(constants.dayMilis),
  "reset": ()=>{flashcardsFlow.start(); return Promise.resolve(true);}
};
actionAndNav.addActions(actions)

function startFlashCards(terms){
  initCardData(terms);
  showNextCard();
  utils.showExclusive("flash-card")
}

function initCardData(terms){
  terms.forEach(term=>term.hideTill=Date.now());
  data.activeCards = terms;
  shuffle(data.activeCards);
}

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
  }
}

function showNextCard(){
  if(data.activeCards.length==0){
    for(let i=0; i<data.inactiveCards.length; i++){
      let card = data.inactiveCards[i];
      if(card.hideTill<Date.now()){
        data.activeCards.push(card);
        data.inactiveCards.splice(i,1);
      }
    }
    if(data.activeCards.length===0){
      showAllComplete();
      return
    }else{
      shuffle(data.activeCards);
    }
  }

  currentCard = data.activeCards.pop();
  data.inactiveCards.push(currentCard);
  console.log("show",data.activeCards, data.inactiveCards, Date.now());  
  showCard();
}

let flashCardHanzi = document.getElementById("hanzi");
let flashCardPinyin = document.getElementById("pinyin");
let flashCardEng = document.getElementById("english");
function showCard(){
  // console.log(currentCard, flashCardHanzi, flashCardPinyin, flashCardEng);
  data.inactiveCards.forEach(c=>{
    // console.log(c.pinyin +" "+ c.hideTill +" "+ (c.hideTill-Date.now()));
  })

  flashCardHanzi.innerText = currentCard.hanzi;
  flashCardPinyin.innerText = currentCard.pinyin;
  flashCardEng.innerText = currentCard.english;

  flipped=false;
  showFrontSide();
  utils.showExclusive("flash-card");
}

let chineseSide = document.getElementById("chinese-side");
let englishSide = document.getElementById("english-side");
let hideForSection = document.getElementById("hide-for-section");
function showFrontSide(){
  if(settings.startWithChinese){
    chineseSide.classList.toggle('showing', true);
    englishSide.classList.toggle('showing', false);
  }else{
    englishSide.classList.toggle('showing', true);
    chineseSide.classList.toggle('showing', false);
  }
  hideForSection.classList.toggle('showing', false);
}

function flip(){
  flipped=true;
  chineseSide.classList.toggle('showing');
  englishSide.classList.toggle('showing');
  hideForSection.classList.toggle('showing', true);
}

function hideAndShowNext(milis){
  return function(){
    currentCard.hideTill = Date.now()+milis;
    showNextCard();
    return Promise.resolve(true);
  }
}

function showAllComplete(){
  utils.showExclusive('complete');
}

// document.getElementById("reset-btn").onclick = function(){
//   initCardData(hiddenCards);
//   hiddenCards = [];
//   showNextCard();
// };

// let frontSideLangSelect = document.getElementById("front-side-lang-select");
// function updateSettings(){
//   startWithChinese = frontSideLangSelect.value==="Chinese";
//   showFrontSide();
//   utils.showExclusive("flash-card");
//   if(flipped) flip();
// }
// setAction("update-settings", updateSettings);

module.exports = flashcardsFlow;