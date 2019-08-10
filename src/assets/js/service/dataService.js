import firebaseService from './firebaseService';
import sheets from './sheets';
import spreadsheets from './spreadsheets';
import values from './values';

export default {
  getOwnCollections: spreadsheets.getUserSpreadsheetsMetadata,
  getPublicCollections: values.getPublicSpreadsheetMetadata,
  getSets: sheets.getMetadata,
  getTerms: values.getTerms,
  insertRecent: firebaseService.insertRecent,
  getRecents: firebaseService.getRecents
};