const spreadsheets = require("./spreadsheets");
const sheets = require("./sheets");
const values = require("./values");

module.exports = {
  getOwnCollections: spreadsheets.getUserSpreadsheetsMetadata,
  getPublicCollections: values.getPublicSpreadsheetMetadata,
  getSets: sheets.getMetadata,
  getTerms: values.getTerms
}