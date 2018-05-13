const googleSettingsFlow = require("./google/settingsFlow");
const constants = require("../utils/constants");

function getProvider(settings){
  if(settings.provider===constants.google){
    return googleSettingsFlow;
  }
}

const settingsFlow = {
  init: function(data, settings, onUpdateData, onUpdateSettings){
    return getProvider(settings).init(data, settings, onUpdateData, onUpdateSettings);
  },
  start: function(settings){
    return getProvider(settings).start();
  }

};

module.exports = settingsFlow;

