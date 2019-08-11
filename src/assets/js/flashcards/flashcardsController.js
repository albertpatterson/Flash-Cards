import actionAndNav from '../utils/actionAndNav';
import view from '../utils/view';
import flashcardsModel from './flashcardsModel';


let settings = null;
let flipped = false;

const actions = {
  'flip': flipCard,
  'show-card-later': showCardLater,
  'hide-card': hideCard,
  'reset': () => {
    flashcardsModel.start();
    proceed();
    return Promise.resolve(true);
  }
};
actionAndNav.addActions(actions);


const clickTime = 250;
const showCardLaterBtn = document.getElementById('show-card-later');
function showCardLater() {
  return new Promise(res => {
    showCardLaterBtn.classList.add('pressed');
    setTimeout(() => {
      showCardLaterBtn.classList.remove('pressed');
      proceed(false);
      res(true);
    }, clickTime)
  })
}

const hideCardBtn = document.getElementById('hide-card');
function hideCard() {
  return new Promise(res => {
    hideCardBtn.classList.add('pressed');
    setTimeout(() => {
      hideCardBtn.classList.remove('pressed');
      proceed(true);
      res(true);
    }, clickTime)
  })
}


const flipCardBtn = document.getElementById('flip-card');
function flipCard() {
  return new Promise(res => {
    flipCardBtn.classList.add('pressed');
    setTimeout(() => {
      flipCardBtn.classList.remove('pressed');
      flip();
      res(true);
    }, clickTime)
  })
}

function proceed(result) {
  const currentCard = flashcardsModel.getNext(result);
  currentCard ? showCard(currentCard) : showAllComplete();
}

const flashcard = document.getElementById('flash-card');
flashcard.addEventListener('keyup', processFlashcardKeyEvents);
const flashcardsController = {
  start: function(_settings) {
    settings = _settings;
    proceed();
  },
  skip: function() {
    proceed(false);
  }
};

const flashCardLearningLanguage = document.getElementById('learning-language');
const flashCardKnownLanguage = document.getElementById('known-language');
const knownLanguageSideIntermediate =
    document.getElementById('known-language-side-intermediate');
const learningLanguageSideIntermediate =
    document.getElementById('learning-language-side-intermediate');
function showCard(currentCard) {
  view.unshow(flashcard);
  flashCardLearningLanguage.innerText = currentCard.learningLanguage;
  learningLanguageSideIntermediate.innerText = currentCard.intermediateLanguage;
  knownLanguageSideIntermediate.innerText = currentCard.intermediateLanguage;
  flashCardKnownLanguage.innerText = currentCard.knownLanguage;

  flipped = false;
  showFrontSide();
  view.showExclusive(flashcard);
  flashcard.focus();
}

const learningLanguageSide = document.getElementById('learning-language-side');
const knownLanguageSide = document.getElementById('known-language-side');
const resultsSection = document.getElementById('results-section');
function showFrontSide() {
  if (settings.startWithLearningLanguage) {
    learningLanguageSide.classList.toggle('showing', true);
    knownLanguageSide.classList.toggle('showing', false);

    if (settings.showIntermediateLanguageOnFront) {
      learningLanguageSideIntermediate.classList.toggle('showing', true);
      knownLanguageSideIntermediate.classList.toggle('showing', false);
    } else {
      learningLanguageSideIntermediate.classList.toggle('showing', false);
      knownLanguageSideIntermediate.classList.toggle('showing', true);
    }

  } else {
    knownLanguageSide.classList.toggle('showing', true);
    learningLanguageSide.classList.toggle('showing', false);

    if (settings.showIntermediateLanguageOnFront) {
      learningLanguageSideIntermediate.classList.toggle('showing', false);
      knownLanguageSideIntermediate.classList.toggle('showing', true);
    } else {
      learningLanguageSideIntermediate.classList.toggle('showing', true);
      knownLanguageSideIntermediate.classList.toggle('showing', false);
    }
  }
  resultsSection.classList.toggle('showing', false);
}

function flip() {
  flipped = true;
  learningLanguageSide.classList.toggle('showing');
  knownLanguageSide.classList.toggle('showing');
  resultsSection.classList.toggle('showing', true);
  flashcard.focus();
}

function showAllComplete() {
  view.showExclusive('complete');
}

function processFlashcardKeyEvents(event) {
  switch (event.key) {
    case 'ArrowUp':
      flipCard();
      break;
    case 'ArrowLeft':
      if (flipped) showCardLater();
      break;
    case 'ArrowRight':
      if (flipped) hideCard();
      break;
  }
}

export default flashcardsController;