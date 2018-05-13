function retrieveAllFiles(callback) {
  var retrievePageOfFiles = function(request, result) {
    request.execute(function(resp) {
      result = result.concat(resp.files);
      var nextPageToken = resp.nextPageToken;
      if (nextPageToken) {
        request = gapi.client.drive.files.list({
          'pageToken': nextPageToken
        });
        retrievePageOfFiles(request, result);
      } else {
        callback(result);
      }
    });
  }
  var initialRequest = gapi.client.drive.files.list({q: "mimeType='application/vnd.google-apps.spreadsheet' and trashed=false"});
  retrievePageOfFiles(initialRequest, []);
}

function getUserSpreadsheetsMetadata(){
  return new Promise((res, rej)=>{  
    retrieveAllFiles(res);
  }).then(extractSpreadsheetDetails);
}

function getSpreadsheetMetadata(spreadsheetId){
  const params = {
    spreadsheetId: spreadsheetId,
    ranges: [],
    includeGridData: false,
  };

  return gapi.client.sheets.spreadsheets.get(params);
}

function extractSpreadsheetDetails(collections){
  return collections.map(item=>{return {name: item.name, id: item.id};});
}

module.exports = {
  getUserSpreadsheetsMetadata,
  getSpreadsheetMetadata
}