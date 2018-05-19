const actionAndNav = require("../utils/actionAndNav");
const constants = require("../utils/constants");
const view = require("../utils/view");
const flashcardsModel = require("./flashcardsModel");

let settings = null;
let flipped = false;

const actions = {
  "flip": function(){
    flip();
    return Promise.resolve();
  },
  "show-card-later": ()=>{proceed(false); return Promise.resolve(true);},
  "hide-card": ()=>{proceed(true); return Promise.resolve(true);},
  "reset": ()=>{flashcardsModel.start(); proceed(); return Promise.resolve(true);}
};
actionAndNav.addActions(actions)

function proceed(result){
  const currentCard = flashcardsModel.getNext(result);
  currentCard ? showCard(currentCard) : showAllComplete();
}

const flashcardsController = {
  start: function(_settings){
    settings = _settings;
    proceed();
  },
  skip: function(){
    proceed(false);
  }
};

const flashCardHanzi = document.getElementById("hanzi");
const flashCardPinyin = document.getElementById("pinyin");
const flashCardEng = document.getElementById("english");
function showCard(currentCard){

  view.unshow("flash-card");

  flashCardHanzi.innerText = currentCard.hanzi;
  flashCardPinyin.innerText = currentCard.pinyin;
  flashCardEng.innerText = currentCard.english;

  flipped=false;
  showFrontSide();
  view.showExclusive("flash-card");
}

const chineseSide = document.getElementById("chinese-side");
const englishSide = document.getElementById("english-side");
const resultsSection = document.getElementById("results-section");
function showFrontSide(){
  if(settings.startWithChinese){
    chineseSide.classList.toggle('showing', true);
    englishSide.classList.toggle('showing', false);
  }else{
    englishSide.classList.toggle('showing', true);
    chineseSide.classList.toggle('showing', false);
  }
  resultsSection.classList.toggle('showing', false);
}

function flip(){
  flipped=true;
  chineseSide.classList.toggle('showing');
  englishSide.classList.toggle('showing');
  resultsSection.classList.toggle('showing', true);
}

function showAllComplete(){
  view.showExclusive('complete');
}

module.exports = flashcardsController;