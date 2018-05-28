const actionAndNav = require("../utils/actionAndNav");
const constants = require("../utils/constants");
const view = require("../utils/view");
const flashcardsModel = require("./flashcardsModel");

let settings = null;
let flipped = false;

const actions = {
  "flip": flipCard,
  "show-card-later": showCardLater,
  "hide-card": hideCard,
  "reset": ()=>{flashcardsModel.start(); proceed(); return Promise.resolve(true);}
};
actionAndNav.addActions(actions);


const clickTime = 250;
const showCardLaterBtn = document.getElementById("show-card-later");
function showCardLater(){
  return new Promise(res=>{
    showCardLaterBtn.classList.add("pressed");
    setTimeout(()=>{
      showCardLaterBtn.classList.remove("pressed");
      proceed(false);
      res(true);
    }, clickTime)
  })
}

const hideCardBtn = document.getElementById("hide-card");
function hideCard(){
  return new Promise(res=>{
    hideCardBtn.classList.add("pressed");
    setTimeout(()=>{
      hideCardBtn.classList.remove("pressed");
      proceed(true);
      res(true);
    }, clickTime)
  })
}


const flipCardBtn = document.getElementById("flip-card");
function flipCard(){
  return new Promise(res=>{
    flipCardBtn.classList.add("pressed");
    setTimeout(()=>{
      flipCardBtn.classList.remove("pressed");
      flip();
      res(true);
    }, clickTime)
  })
}

function proceed(result){
  const currentCard = flashcardsModel.getNext(result);
  currentCard ? showCard(currentCard) : showAllComplete();
}

const flashcard = document.getElementById("flash-card");
flashcard.addEventListener("keyup", processFlashcardKeyEvents);
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

  view.unshow(flashcard);
  flashCardHanzi.innerText = currentCard.hanzi;
  flashCardPinyin.innerText = currentCard.pinyin;
  flashCardEng.innerText = currentCard.english;

  flipped=false;
  showFrontSide();
  view.showExclusive(flashcard);
  flashcard.focus();
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
  flashcard.focus();
}

function showAllComplete(){
  view.showExclusive('complete');
}

function processFlashcardKeyEvents(event){
  switch(event.key) {
    case "ArrowUp":
      flipCard();
      break;
    case "ArrowLeft":
      if(flipped) showCardLater();
      break;
    case "ArrowRight":
      if(flipped) hideCard();
      break;
  }
}

module.exports = flashcardsController;