let onSignin = null;
let onSignout = null;
function onStatusUpdate(state){
  state ? onSignin() : onSignout();
}

function init(config, _onSignin, _onSignout){
  onSignin = _onSignin;
  onSignout = _onSignout;
  
  return load_gapi()
  .then(loadAuthClient)
  .then(()=>initClient(config, onStatusUpdate))
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
  return gapi.client.init(config)
  .then(function () {
    const googleAuth = gapi.auth2.getAuthInstance();
    googleAuth.isSignedIn.listen(signInStatusUpdateCallback);
    googleAuth.isSignedIn.get() ? onSignin() : onSignout();
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