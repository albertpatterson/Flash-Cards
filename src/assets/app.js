import './scss/app.scss';
import './media/settings.png'

import authFlow from './js/auth/authFlow';
import flashcards from './js/flashcards/flashcards';
import dataService from './js/service/dataService';
import settingsFlow from './js/settings/settingsFlow';
import constants from './js/utils/constants';

import view from './js/utils/view';

// set fontsize based on device size
document.querySelector('html').style.fontSize = document.body.style.fontSize =
    screen.availHeight * devicePixelRatio * .015 + 'px';

const data = {
  availableSets: [],
  activeCards: [],
  inactiveCards: []
};

const settings = {
  google: {
    spreadsheetId: '',
  },
  setSelected: [],
  startWithChinese: false,
  provider: constants.google,
};

function onSignin() {
  return settingsFlow.start(settings).then(function() {
    view.show('settings-btn');
    view.showExclusive('app-modal');
  })
}

function onSignout() {
  view.showExclusive('login-modal');
}

authFlow.init(onSignin, onSignout);

settingsFlow.init(
    data, settings,
    () => {
      return dataService.getTerms(settings, data).then(terms => {
        flashcards.start(settings, terms);
        view.showExclusive('flash-card');
      });
    },
    () => {
      flashcards.skip();
      return Promise.resolve(true);
    });