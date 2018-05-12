const actionAndNav = require("../../utils/actionAndNav");
const constants = require("../../utils/constants");
const dataService = require("../../service/dataService");

let data = null;
let settings = null;
let onUpdateData = null;
let onUpdateSettings = null;

const actions = {
  "use-alberts-list": function(){
    settings.google.spreadsheetId = constants.albertsSheetId;
    document.getElementById("spreadsheet-id").value = settings.google.spreadsheetId; 
    
    return getSets().then(setupSetSelection);
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

function getSets(){
  return dataService.getSets(settings);
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

let settingsFlow = {
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
  
    // let apiKeyBtn = document.getElementById("api-key-info");
    // apiKeyBtn.classList.add("info-btn");
    // apiKeyBtn.target="_blank";
    // apiKeyBtn.href="https://developers.google.com/sheets/api/guides/authorizing#APIKey";
  
    document.getElementById("front-side-lang-select").selectedIndex = settings.startWithChinese ? 0 : 1;
  },
};

module.exports = settingsFlow;