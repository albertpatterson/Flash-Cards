const activeDeckMaxSize = 10;
let currentCard = null;
let totalCards;

const cardDecks = {
  reserve: [],
  active: [],
  inactive: [],
  complete: []
};

function start(terms) {
  if (terms) {
    cardDecks.reserve = terms;
    cardDecks.active = [];
    cardDecks.inactive = [];
    cardDecks.complete = [];
    currentCard = null;
    totalCards = terms.length;
  } else {
    resetCards();
  }
  shuffle(cardDecks.reserve);
}

function resetCards() {
  start(getAllTerms());
}

function getAllTerms() {
  const allTerms = [];
  for (const type in cardDecks) {
    allTerms.push(...cardDecks[type]);
  }
  return allTerms;
}

function shuffle(a) {
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

  if (cardDecks.active.length == 0) refillActiveCardDeck();

  if (cardDecks.active.length > 0) {
    currentCard = cardDecks.active.pop();
  }

  return currentCard;
}

function refillActiveCardDeck() {
  const inactiveCount = cardDecks.inactive.length;
  const newCount =
      Math.min(activeDeckMaxSize - inactiveCount, cardDecks.reserve.length);
  cardDecks.active.push(...cardDecks.inactive);
  cardDecks.inactive = [];
  cardDecks.active.push(...cardDecks.reserve.splice(0, newCount));
  shuffle(cardDecks.active);
}

// function resetIncompleteCards() {
//   cardDecks.active.push(...cardDecks.inactive);
//   cardDecks.inactive = [];
//   shuffle();
// }


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