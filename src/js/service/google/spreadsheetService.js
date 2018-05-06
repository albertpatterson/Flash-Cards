function makeGetUrl(apiKey, spreadsheetID, params){
  console.log(arguments)

  let url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetID}?key=${apiKey}`;
  for(let p in params){
    url+=`&${p}=${params[p]}`;
  }
  console.log(url)

  return url;
}

function makeBatchGetUrl(apiKey, spreadsheetID, params){
  console.log(arguments)
  let url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetID}/values:batchGet?key=${apiKey}`;
  for(let p in params){
    if(p==="ranges"){
      params[p].forEach(r=>url+=`&ranges=${r}`);
    }else{
      url+=`&${p}=${params[p]}`;  
    }
  }
  return url;
}

function getSheetTitles(apiKey, spreadsheedId){
  let sheetNamesUrl = makeGetUrl(
                        apiKey,
                        spreadsheedId, 
                        { fields: "sheets.properties.title"});
  return getGoogleSheetData(sheetNamesUrl);
}

function extractSheetTitles(sheets){
  return sheets.map(s=>s.properties.title);
}
  
function batchGetSheetData(apiKey, spreadsheedId, sheetNames){
  var sheetDataUrl = makeBatchGetUrl(
                      apiKey,
                      spreadsheedId,  
                      { ranges: sheetNames});
  return getGoogleSheetData(sheetDataUrl);
}

function batchExtractTerms(valueRanges){
  return valueRanges.map(vr=>vr.values.map(arrToCard)).reduce((all, next)=>all.concat(...next),[]);
}
let arrToCard = a=>{return {hanzi: a[0], pinyin: a[1], english: a[2]}};

function getGoogleSheetData(url){
  console.log(url)
  return new Promise((res, rej)=>{
    let oReq = new XMLHttpRequest();
    oReq.addEventListener("load", oReg=>parseGoogleSheetResponse(oReq.response).then(res).catch(rej));
    oReq.addEventListener("error", rej);
    oReq.open("GET", url);
    oReq.send();  
  })
}

function parseGoogleSheetResponse(JSON_response){
  let parsedResponse = JSON.parse(JSON_response);
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
    console.log(settings);
    return getSheetTitles(settings.google.apiKey, settings.google.spreadsheetId)
    .then(extractSheetTitles);
  },

  getTerms: function(settings, setsToGet){
    return batchGetSheetData(settings.google.apiKey, settings.google.spreadsheetId, setsToGet)
    .then(batchExtractTerms);
  }
};