let localVals = {
  albertsSheetId: "1af9vsz-qcJooeql9yGn0TjOGGTE3amVIRm-Yu_y4bLU",
  minMilis: 60*1000,
  chinese: 'Chinese',
  english: 'English',
  google: "Google",
  spreadsheetIdRegex: /[a-zA-Z0-9-_]+/
};

localVals.hourMilis = 60*localVals.minMilis;
localVals.dayMilis = 24*localVals.hourMilis;

Object.freeze(localVals);

module.exports = localVals;