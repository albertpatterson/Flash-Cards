
function getSheetTitles(spreadsheetId){

  let params = {
    spreadsheetId: spreadsheetId,
    ranges: [],
    includeGridData: false,
    fields: "sheets.properties.title"
  };
  let request = gapi.client.sheets.spreadsheets.get(params);
  return request.then(r=>parseGetResponse(r.result));
}

function parseGetResponse(response){
  return new Promise((res, rej)=>{
    if(response.error){
      rej(response.error);
    }else if(response.sheets){
      res(response.sheets);
    }else{
      rej(response);
    }
  })
}

function extractSheetTitles(sheets){
  return sheets.map(s=>s.properties.title);
}
  

module.exports = {
  getMetadata: function(settings){
    return getSheetTitles(settings.google.spreadsheetId)
    .then(extractSheetTitles);
  }
};