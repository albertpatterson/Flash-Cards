const googleSpreadsheetDataService = require("./googleSpreadsheetDataService");
const constants = require("./constants");

function getProvider(settings){
  if(settings.provider===constants.google){
    return googleSpreadsheetDataService;
  }
}

const dataService = {
  getSets: function(settings){
    return getProvider(settings).getSetNames(settings);
  },

  getTerms: function(settings, setsToGet){
    return getProvider(settings).getTerms(settings, setsToGet);
  }
};

module.exports = dataService;

