function init(config, signInStatusUpdateCallback){
  return load_gapi()
  .then(loadAuthClient)
  .then(()=>initClient(config, signInStatusUpdateCallback))
}

function load_gapi(){
  return new Promise((res, rej)=>{
    let loaded = false;
    let script = document.createElement("script");
    script.src = "https://apis.google.com/js/api.js";
    script.onload=res;
    script.onerror=rej;
    document.head.appendChild(script);
  });
}

function loadAuthClient(){
  return new Promise((res, rej)=>{
    gapi.load('client:auth2', e=>e?rej(e):res())
  })
}

function initClient(config, signInStatusUpdateCallback) {
  // Initialize the client with API key and People API, and initialize OAuth with an
  // OAuth 2.0 client ID and scopes (space delimited string) to request access.
  return gapi.client.init(config).then(function () {
    const googleAuth = gapi.auth2.getAuthInstance();
    googleAuth.isSignedIn.listen(signInStatusUpdateCallback);
    // googleAuth.disconnect();
    // googleAuth.signOut();
    return googleAuth.isSignedIn.get();
  })
}

function signIn(){
  gapi.auth2.getAuthInstance().signIn();
}

function signOut(){
  gapi.auth2.getAuthInstance().signOut();
}

module.exports = {
  init,
  signIn,
  signOut
};