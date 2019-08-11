import dataService from '../service/dataService';
import actionAndNav from '../utils/actionAndNav';
import constants from '../utils/constants';
import view from '../utils/view';

let data = null;
let settings = null;
let onUpdateData = null;
let onUpdateSettings = null;

let choosenName = null;

const actions = {
  'update-spreadsheet-id': function(e) {
    const target = e.target;
    const id = e.target.value;
    updateCollectionSelectionViewChoice(target, id);
    return Promise.resolve(true);
  },
  'set-spreadsheet-id': function() {
    const id = document.getElementById('spreadsheet-id').value;
    settings.google.spreadsheetId = id;

    if (!settings.google.spreadsheetId.match(constants.spreadsheetIdRegex)) {
      return Promise.reject(new Error('Invalid Spreadsheet ID'));
    }

    dataService.insertRecent({name: choosenName, id: id})
        .then(initRecentCollectionSelectionView);

    return getSets().then(setupSetSelection);
  },
  'set-sheets': function() {
    data.availableSets.forEach((t, i) => {
      settings.setSelected[i] =
          document.getElementById(getSheetCheckboxId(t, i)).checked;
    });
    return onUpdateData ? onUpdateData() : Promise.resolve(true);
  },
  'update-settings': function() {
    updateSettingsFromPanel();
    return onUpdateSettings ? onUpdateSettings() : Promise.resolve(true);
  }
};
actionAndNav.addActions(actions);

function initCollectionSelectionView() {
  return Promise.all([
    initOwnCollectionSelectionView(), initPublicCollectionSelectionView(),
    initRecentCollectionSelectionView()
  ]);
}

const ownSpreadsheetSelect = document.getElementById('choose-own-spreadsheet');
const defaultOwnSpreadsheetOption =
    document.getElementById('default-own-spreadsheet-option');
function initOwnCollectionSelectionView() {
  return dataService.getOwnCollections(settings, data)
      .then(
          c => initSpreadsheetSelectValues(
              ownSpreadsheetSelect, defaultOwnSpreadsheetOption, c))
}

const publicSpreadsheetSelect =
    document.getElementById('choose-public-spreadsheet');
const defaultPublicSpreadsheetOption =
    document.getElementById('default-public-spreadsheet-option');
function initPublicCollectionSelectionView() {
  return dataService.getPublicCollections(settings, data)
      .then(
          c => initSpreadsheetSelectValues(
              publicSpreadsheetSelect, defaultPublicSpreadsheetOption, c))
}

const recentSpreadsheetSelect =
    document.getElementById('choose-recent-spreadsheet');
const defaultRecentSpreadsheetOption =
    document.getElementById('default-recent-spreadsheet-option');
function initRecentCollectionSelectionView() {
  return dataService.getRecents(settings, data)
      .then(
          c => initSpreadsheetSelectValues(
              recentSpreadsheetSelect, defaultRecentSpreadsheetOption, c))
}

function initSpreadsheetSelectValues(
    spreadsheetSelect, defaultValueEl, spreadsheets) {
  [].forEach.call(
      spreadsheetSelect.children,
      c => c !== defaultValueEl && spreadsheetSelect.removeChild(c));

  spreadsheets.forEach(s => {
    const opt = document.createElement('option');
    opt.value = s.id;
    opt.innerText = s.name;
    opt.classList = 'input';
    spreadsheetSelect.appendChild(opt);
  });

  spreadsheetSelect.disabled === spreadsheets.length === 0;
  if (spreadsheets.length === 0) {
    spreadsheetSelect.disabled = true;
    defaultValueEl.innerText = 'None available'
  } else {
    spreadsheetSelect.disabled = false;
    defaultValueEl.innerText = 'Choose spreadsheet'
  }
}

const spreadsheetIdInput = document.getElementById('spreadsheet-id');
function updateCollectionSelectionViewChoice(target) {
  if (target === ownSpreadsheetSelect) {
    choosenName = target.selectedOptions[0].innerText;
    publicSpreadsheetSelect.value = '';
    recentSpreadsheetSelect.value = '';
    spreadsheetIdInput.value = ownSpreadsheetSelect.value;
  } else if (target === publicSpreadsheetSelect) {
    choosenName = target.selectedOptions[0].innerText;
    ownSpreadsheetSelect.value = '';
    recentSpreadsheetSelect.value = '';
    spreadsheetIdInput.value = publicSpreadsheetSelect.value;
  } else if (target === recentSpreadsheetSelect) {
    choosenName = target.selectedOptions[0].innerText;
    ownSpreadsheetSelect.value = '';
    publicSpreadsheetSelect.value = '';
    spreadsheetIdInput.value = recentSpreadsheetSelect.value;
  } else {
    choosenName = null;
    ownSpreadsheetSelect.value = '';
    publicSpreadsheetSelect.value = '';
    recentSpreadsheetSelect.value = '';
  }
}

function getSets() {
  return dataService.getSets(settings, data);
}

function setupSetSelection(sets) {
  data.availableSets = sets;
  initSelectedSheetTitles();
  initChooseSheets();
  return true;
}

function updateSettingsFromPanel() {
  settings.startWithLearningLanguage =
      document.getElementById('front-side-lang-select')
          .selectedOptions[0]
          .value === constants.learningLanguage;

  settings.showIntermediateLanguageOnFront =
      !document.getElementById('intermediate-lang-side-select').selectedIndex;
}

function initSelectedSheetTitles() {
  settings.setSelected = data.availableSets.map(() => false);
}

function initChooseSheets() {
  let groupWrapperId = 'sheet-checkbox-group-wrapper';
  let checkboxWrapperClass = 'sheet-checkbox-wrapper'
  let groupWrapper = document.getElementById(groupWrapperId);
  let checkboxWrappers =
      groupWrapper.querySelectorAll('.' + checkboxWrapperClass) || [];
  [].forEach.call(
      checkboxWrappers,
      checkboxWrapper => groupWrapper.removeChild(checkboxWrapper))
  data.availableSets.forEach((sheetTitle, idx) => {
    let checkboxWrapper = document.createElement('div');
    checkboxWrapper.classList.add(checkboxWrapperClass);
    groupWrapper.appendChild(checkboxWrapper);

    let id = getSheetCheckboxId(sheetTitle, idx);
    let cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.classList.add('checkbox');
    cb.id = id;
    checkboxWrapper.appendChild(cb)

    let lab = document.createElement('label');
    lab.for = id;
    cb.classList.add('label');
    lab.innerText = sheetTitle;
    checkboxWrapper.appendChild(lab);
  })
}

function getSheetCheckboxId(title, idx) {
  return `sheet-checkbox-${title}-${idx}`;
}

const settingsFlow = {
  init: function(_data, _settings, _onUpdateData, _onUpdateSettings) {
    data = _data;
    settings = _settings;
    onUpdateData = _onUpdateData;
    onUpdateSettings = _onUpdateSettings;

    actionAndNav.addActions(actions);

    let sheetIDBtn = document.getElementById('spreadsheet-info');
    sheetIDBtn.classList.add('info-btn');
    sheetIDBtn.target = '_blank';
    sheetIDBtn.href =
        'https://developers.google.com/sheets/api/guides/concepts#sheet_id';

    document.getElementById('front-side-lang-select').selectedIndex =
        settings.startWithLearningLanguage ? 0 : 1;

    document.getElementById('intermediate-lang-side-select').selectedIndex =
        settings.showIntermediateLanguateOnFront ? 0 : 1;
  },

  start: function() {
    return initCollectionSelectionView().then(
        () => view.showExclusive('choose-spreadsheet'));
  }
};

export default settingsFlow;