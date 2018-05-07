// function makeGetUrl(apiKey, spreadsheetID, params){
//   console.log(arguments)

//   let url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetID}?key=${apiKey}`;
//   for(let p in params){
//     url+=`&${p}=${params[p]}`;
//   }
//   console.log(url)

//   return url;
// }

// function makeBatchGetUrl(apiKey, spreadsheetID, params){
//   console.log(arguments)
//   let url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetID}/values:batchGet?key=${apiKey}`;
//   for(let p in params){
//     if(p==="ranges"){
//       params[p].forEach(r=>url+=`&ranges=${r}`);
//     }else{
//       url+=`&${p}=${params[p]}`;  
//     }
//   }
//   return url;
// }

// function getGoogleSheetData(url){
//   console.log(url)
//   return new Promise((res, rej)=>{
//     let oReq = new XMLHttpRequest();
//     oReq.addEventListener("load", oReg=>parseGoogleSheetResponse(oReq.response).then(res).catch(rej));
//     oReq.addEventListener("error", rej);
//     oReq.open("GET", url);
//     oReq.send();  
//   })
// }

function getSheetTitles(spreadsheedId){

  let params = {
    spreadsheetId: spreadsheedId,
    ranges: [],
    includeGridData: false,
    fields: "sheets.properties.title"
  };
  let request = gapi.client.sheets.spreadsheets.get(params);
  return request.then(r=>parseGoogleSheetResponse(r.result));
}

function extractSheetTitles(sheets){
  return sheets.map(s=>s.properties.title);
}
  
function batchGetSheetData(spreadsheedId, sheetNames){
  let params = {
    spreadsheetId: spreadsheedId,
    ranges: sheetNames, 
  };

  var request = gapi.client.sheets.spreadsheets.values.batchGet(params);
  return request.then(r=>parseGoogleSheetResponse(r.result));
}

function batchExtractTerms(valueRanges){
  return valueRanges.map(vr=>vr.values.map(arrToCard)).reduce((all, next)=>all.concat(...next),[]);
}
let arrToCard = a=>{return {hanzi: a[0], pinyin: a[1], english: a[2]}};

function parseGoogleSheetResponse(response){
  let parsedResponse = typeof response === "string" ? JSON.parse(JSON_response) : response;

  return new Promise((res, rej)=>{
    if(parsedResponse.error){
      rej(parsedResponse.error);
    }else if(parsedResponse.sheets){
      res(parsedResponse.sheets);
    }else if(parsedResponse.valueRanges){
      res(parsedResponse.valueRanges);
    }else{
      res(parsedResponse);
    }
  })
}

module.exports = {
  getSetNames: function(settings){
    return getSheetTitles(settings.google.spreadsheetId)
    .then(extractSheetTitles);
  },

  getTerms: function(settings, setsToGet){
    return batchGetSheetData(settings.google.spreadsheetId, setsToGet)
    .then(batchExtractTerms);
  }
};