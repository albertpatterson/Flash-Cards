const googleSpreadsheetDataService = require("./google/spreadsheetService");
const constants = require("../utils/constants");

function getProvider(settings){
  if(settings.provider===constants.google){
    return googleSpreadsheetDataService;
  }
}

const dataService = {

  getOwnCollections: function(settings, data){
    return getProvider(settings).getOwnCollections(settings, data);
  },

  getPublicCollections: function(settings, data){
    return getProvider(settings).getPublicCollections(settings, data);
  },

  getSets: function(settings, data){
    return getProvider(settings).getSets(settings, data);
  },

  getTerms: function(settings, data){
    return getProvider(settings).getTerms(settings, data);
  }
};

module.exports = dataService;

