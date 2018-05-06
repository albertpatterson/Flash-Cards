const googleSettingsFlow = require("./google/settingsFlow");
const constants = require("../utils/constants");

function getProvider(settings){
  if(settings.provider===constants.google){
    return googleSettingsFlow;
  }
}

const settingsFlow = {
  init: function(data, settings, onUpdateData, onUpdateSettings){
    getProvider(settings).init(data, settings, onUpdateData, onUpdateSettings);
  }
};

module.exports = settingsFlow;

