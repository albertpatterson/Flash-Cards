const spreadsheets = require("./spreadsheets");
const sheets = require("./sheets");
const values = require("./values");
const firebaseService = require("./firebaseService");
module.exports = {
  getOwnCollections: spreadsheets.getUserSpreadsheetsMetadata,
  getPublicCollections: values.getPublicSpreadsheetMetadata,
  getSets: sheets.getMetadata,
  getTerms: values.getTerms,
  insertRecent: firebaseService.insertRecent,
  getRecents: firebaseService.getRecents
};