import googleConfig from '../../../../not_shared/config/googleConfig';

function init(onStatusUpdate) {
  return load_gapi()
      .then(loadAuthClient)
      .then(() => initClient(onStatusUpdate));
}

function load_gapi() {
  return new Promise((res, rej) => {
    let loaded = false;
    let script = document.createElement('script');
    script.src = 'https://apis.google.com/js/api.js';
    script.onload = res;
    script.onerror = rej;
    document.head.appendChild(script);
  });
}

function loadAuthClient() {
  return new Promise(
      (res, rej) => {gapi.load('client:auth2', e => e ? rej(e) : res())})
}

function initClient(onStatusUpdate) {
  return gapi.client.init(googleConfig).then(function() {
    const googleAuth = gapi.auth2.getAuthInstance();
    const getGoogleUser = isSignedIn =>
        isSignedIn ? googleAuth.currentUser.get() : null;
    googleAuth.isSignedIn.listen(
        isSignedIn => onStatusUpdate(getGoogleUser(isSignedIn)));
    onStatusUpdate(getGoogleUser(googleAuth.isSignedIn.get()));
  });
}

function signIn() {
  return gapi.auth2.getAuthInstance().signIn();
}

function signOut() {
  return gapi.auth2.getAuthInstance().signOut();
}

export default {init, signIn, signOut};