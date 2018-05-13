const actionAndNav = require("../../utils/actionAndNav");
const constants = require("../../utils/constants");
const dataService = require("../../service/dataService");
const view = require("../../utils/view")

let data = null;
let settings = null;
let onUpdateData = null;
let onUpdateSettings = null;

const actions = {
  // "use-alberts-list": function(){
  //   settings.google.spreadsheetId = constants.albertsSheetId;
  //   document.getElementById("spreadsheet-id").value = settings.google.spreadsheetId; 
    
  //   return getSets().then(setupSetSelection);
  // },
  "update-spreadsheet-id": function(e){
    const target = e.target;
    const id = e.target.value;
    updateCollectionSelectionViewChoice(target, id);
    return Promise.resolve(true);
  },
  "set-spreadsheet-id": function(){

    settings.google.spreadsheetId = document.getElementById("spreadsheet-id").value;

    if(!settings.google.spreadsheetId.match(constants.spreadsheetIdRegex)){
      return Promise.reject(new Error("Invalid Spreadsheet ID"));
    }
  
    return getSets().then(setupSetSelection);
  },
  "set-sheets": function(){
    data.availableSets.forEach((t, i)=>{
      settings.setSelected[i]=document.getElementById(getSheetCheckboxId(t, i)).checked;
    })
    return onUpdateData ? onUpdateData() : Promise.resolve(true);
  },
  "update-settings": function(){
    updateSettingsFromPanel();
    return onUpdateSettings ? onUpdateSettings() : Promise.resolve(true);
  }
}
actionAndNav.addActions(actions);

function initCollectionSelectionView(collections){
  return Promise.all([initOwnCollectionSelectionView(), initPublicCollectionSelectionView()]);
}

const ownSpreadsheetSelect = document.getElementById("choose-own-spreadsheet");
const defaultOwnSpreadsheetOption = document.getElementById("default-own-spreadsheet-option");
function initOwnCollectionSelectionView(){
  return dataService.getOwnCollections(settings, data)
  .then(c=>initSpreadsheetSelectValues(ownSpreadsheetSelect, defaultOwnSpreadsheetOption, c))
}

const publicSpreadsheetSelect = document.getElementById("choose-public-spreadsheet");
const defaultPublicSpreadsheetOption = document.getElementById("default-public-spreadsheet-option");
function initPublicCollectionSelectionView(){
  return dataService.getPublicCollections(settings, data)
  .then(c=>initSpreadsheetSelectValues(publicSpreadsheetSelect, defaultPublicSpreadsheetOption, c))
}

function initSpreadsheetSelectValues(spreadsheetSelect, defaultValueEl, spreadsheets){
  [].forEach.call(spreadsheetSelect.children, c=>c!==defaultValueEl && spreadsheetSelect.removeChild(c));
  
  spreadsheets.forEach(s=>{
    const opt = document.createElement("option");
    opt.value = s.id;
    opt.innerText = s.name;
    opt.classList = "input";
    spreadsheetSelect.appendChild(opt);
  });

  spreadsheetSelect.disabled === spreadsheets.length===0;
  if(spreadsheets.length===0){
    spreadsheetSelect.disabled = true;
    defaultValueEl.innerText = "None available"
  }else{
    spreadsheetSelect.disabled = false;
    defaultValueEl.innerText = "Choose spreadsheet"
  }
}

const spreadsheetIdInput = document.getElementById("spreadsheet-id");
function updateCollectionSelectionViewChoice(target){
  if(target === ownSpreadsheetSelect ){
    publicSpreadsheetSelect.value="";
    spreadsheetIdInput.value = ownSpreadsheetSelect.value;
  }else if(target === publicSpreadsheetSelect){
    ownSpreadsheetSelect.value="";
    spreadsheetIdInput.value = publicSpreadsheetSelect.value;
  }else {
    ownSpreadsheetSelect.value="";
    publicSpreadsheetSelect.value="";
  }
}

function getSets(){
  return dataService.getSets(settings, data);
}

function setupSetSelection(sets){
  data.availableSets = sets;
  initSelectedSheetTitles();
  initChooseSheets();
  return true;
}

function updateSettingsFromPanel(){
  settings.startWithChinese = document.getElementById("front-side-lang-select").selectedOptions[0].value===constants.chinese;
}

function initSelectedSheetTitles(){
  settings.setSelected = data.availableSets.map(()=>false);
}

function initChooseSheets(){
  let groupWrapperId = "sheet-checkbox-group-wrapper";
  let checkboxWrapperClass = "sheet-checkbox-wrapper"
  let groupWrapper = document.getElementById(groupWrapperId);
  let checkboxWrappers = groupWrapper.querySelectorAll("."+checkboxWrapperClass) || [];
  [].forEach.call(checkboxWrappers, checkboxWrapper=>groupWrapper.removeChild(checkboxWrapper))
  data.availableSets.forEach((sheetTitle, idx)=>{
    let checkboxWrapper = document.createElement("div");
    checkboxWrapper.classList.add(checkboxWrapperClass);
    groupWrapper.appendChild(checkboxWrapper);

    let id = getSheetCheckboxId(sheetTitle, idx);
    let cb = document.createElement("input");
    cb.type="checkbox";
    cb.classList.add("checkbox");
    cb.id=id;
    checkboxWrapper.appendChild(cb)

    let lab = document.createElement("label");
    lab.for=id;
    cb.classList.add("label");
    lab.innerText=sheetTitle;
    checkboxWrapper.appendChild(lab);
  })
}

function getSheetCheckboxId(title, idx){
  return `sheet-checkbox-${title}-${idx}`;
}

const settingsFlow = {
  init: function(_data, _settings, _onUpdateData, _onUpdateSettings){
    data = _data;
    settings = _settings;
    onUpdateData = _onUpdateData;
    onUpdateSettings = _onUpdateSettings;

    actionAndNav.addActions(actions);

    let sheetIDBtn = document.getElementById("spreadsheet-info");
    sheetIDBtn.classList.add("info-btn");
    sheetIDBtn.target="_blank";
    sheetIDBtn.href="https://developers.google.com/sheets/api/guides/concepts#sheet_id";
  
    document.getElementById("front-side-lang-select").selectedIndex = settings.startWithChinese ? 0 : 1;
  },

  start: function(){
    return initCollectionSelectionView().then(()=>view.showExclusive("choose-spreadsheet"));
  }
};

module.exports = settingsFlow;