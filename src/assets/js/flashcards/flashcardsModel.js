
let currentCard = null;
let totalCards;

const cardDecks = {
  active: [],
  inactive: [],
  complete: []
};

function start(terms) {
  if (terms) {
    cardDecks.active = terms;
    cardDecks.inactive = [];
    cardDecks.complete = [];
    currentCard = null;
    totalCards = terms.length;
  } else {
    resetCards();
  }
  shuffle();
}

function resetCards() {
  cardDecks.active.push(...cardDecks.inactive.concat(cardDecks.complete));
  if (currentCard) {
    cardDecks.active.push(currentCard);
  }
  cardDecks.inactive = [];
  cardDecks.complete = [];
  currentCard = null;
}

function shuffle() {
  const a = cardDecks.active;
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
}

function getNext(previousResult) {
  if (currentCard && typeof previousResult === 'undefined') {
    throw new Error('No result provided for current card.')
  } else if (currentCard) {
    placeCurrentInDeck(previousResult);
  }

  if (cardDecks.active.length == 0) resetIncompleteCards();

  if (cardDecks.active.length > 0) {
    currentCard = cardDecks.active.pop();
  }

  return currentCard;
}

function resetIncompleteCards() {
  cardDecks.active.push(...cardDecks.inactive);
  cardDecks.inactive = [];
  shuffle();
}


function placeCurrentInDeck(result) {
  if (result) {
    cardDecks.complete.push(currentCard);
  } else {
    cardDecks.inactive.push(currentCard);
  }
  currentCard = null;
}

function getTotalCardCount() {
  return totalCards;
}

function getHiddenCardCount() {
  return cardDecks.complete.length;
}


export default {
  start,
  getNext,
  getTotalCardCount,
  getHiddenCardCount,
}