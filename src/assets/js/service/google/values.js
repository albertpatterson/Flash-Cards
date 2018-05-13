const constants = require("../../utils/constants");
const spreadsheets = require("./spreadsheets");
function getTerms(spreadsheetId, setsToGet){

  let params = {
    spreadsheetId: spreadsheetId,
    ranges: setsToGet, 
  };

  var request = gapi.client.sheets.spreadsheets.values.batchGet(params);
  return request.then(r=>parseResponse(r.result, 'valueRanges'));
}

function batchExtractTerms(valueRanges){
  return valueRanges.map(vr=>vr.values.map(arrToCard)).reduce((all, next)=>all.concat(...next),[]);
}
let arrToCard = a=>{return {hanzi: a[0], pinyin: a[1], english: a[2]}};



function getPublicSpreadsheetMetadata(settings){
  let params = {
    spreadsheetId: constants.publicListSpreadsheetId,
    range: "Sheet1", 
  };

  return gapi.client.sheets.spreadsheets.values.get(params)
  .then(r=>parseResponse(r.result, 'values'))
  .then(values=>{
    const ids = values[0];
    console.log(ids);
    return getSpreadsheetNames(ids);
  })
  .then(md=>{
    console.log(md);
    return md;
  })

}

function getSpreadsheetNames(ids){
  return Promise.all(
    ids.map(id=>{
      return spreadsheets.getSpreadsheetMetadata(id)
      .then(function(r){
        return parseResponse(r.result, 'properties')
      })
      .then(function(p){
        return {id, name: p.title};
      })
    })
  )
}

function parseResponse(response, field){
  return new Promise((res, rej)=>{
    if(response.error){
      rej(response.error);
    }else if(response[field]){
      res(response[field]);
    }else{
      rej(response);
    }
  })
}

module.exports = {
  getPublicSpreadsheetMetadata,


  getTerms(settings, data){
    let setsToGet = data.availableSets.filter((_, i)=>settings.setSelected[i]);
    return getTerms(settings.google.spreadsheetId, setsToGet)
    .then(batchExtractTerms);
  },
}

