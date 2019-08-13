import actionAndNav from '../utils/actionAndNav';
import view from '../utils/view';
import flashcardsModel from './flashcardsModel';


let settings = null;
let flipped = false;
let complete = false;

const clickTime = 250;
const showCardLaterBtn = document.getElementById('show-card-later');
showCardLaterBtn.addEventListener('click', () => flipped && showCardLater());
showCardLaterBtn.addEventListener('touchstart', e => e.stopPropagation());
showCardLaterBtn.addEventListener('touchend', e => e.stopPropagation());
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
hideCardBtn.addEventListener('click', () => flipped && hideCard());
hideCardBtn.addEventListener('touchstart', e => e.stopPropagation());
hideCardBtn.addEventListener('touchend', e => e.stopPropagation());
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
flipCardBtn.addEventListener('click', flipCard);
flipCardBtn.addEventListener('touchstart', e => e.stopPropagation());
flipCardBtn.addEventListener('touchend', e => e.stopPropagation());
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

const resetCardsBtn = document.getElementById('reset-cards');
resetCardsBtn.addEventListener('click', () => complete && reset());
resetCardsBtn.addEventListener('touchstart', e => e.stopPropagation());
resetCardsBtn.addEventListener('touchend', e => e.stopPropagation());
function reset() {
  flashcardsModel.start();
  proceed();
  return Promise.resolve(true);
}

const flashcard = document.getElementById('flash-card');
flashcard.addEventListener('keyup', processFlashcardKeyEvents);
flashcard.addEventListener('touchstart', handleTouchStart);
flashcard.addEventListener('touchend', handleTouchEnd);

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

let touchStarts = {};
const clientWidth = document.body.clientWidth;
const nextCardThreshold = clientWidth / 4;
const flipCardThreshold = clientWidth / 100;

function handleTouchStart(touchEvent) {
  for (const thouch of touchEvent.changedTouches) {
    touchStarts[thouch.identifier] = thouch.clientX;
  }
}
function handleTouchEnd(touchEvent) {
  for (const thouch of touchEvent.changedTouches) {
    const start = touchStarts[thouch.identifier];
    const diff = thouch.clientX - start;
    delete touchStarts[thouch.identifier];

    if (diff > nextCardThreshold) {
      if (flipped) hideCard();
    } else if (diff < -1 * nextCardThreshold) {
      if (flipped) showCardLater();
    } else if (Math.abs(diff) < flipCardThreshold) {
      flipCard();
    }
  }
}

function proceed(result) {
  const currentCard = flashcardsModel.getNext(result);
  if (!!currentCard) {
    complete = false;
    showCard(currentCard);
    updateProgress();
  } else {
    complete = true;
    showAllComplete();
  }
}

const completeCardCountEl = document.getElementById('complete-card-count');
const totalCardCountEl = document.getElementById('total-card-count');
function updateProgress() {
  completeCardCountEl.innerText = flashcardsModel.getHiddenCardCount();
  totalCardCountEl.innerText = flashcardsModel.getTotalCardCount();
}

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


export default flashcardsController;