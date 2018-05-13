const auth = require("./auth");
const actionAndNav = require("../utils/actionAndNav");

let onSignin = null;
let onSignout = null;

const actions ={
  "sign-in": function(){
    auth.signIn();
    return Promise.resolve(true);
  },
  "sign-out": function(){
    auth.signOut();
    return Promise.resolve(true);
  },
};
actionAndNav.addActions(actions)

function init(config, _onSignin, _onSignout){
  onSignin = _onSignin;
  onSignout = _onSignout;
  return auth.init(config, onSignin, onSignout);
}

module.exports = {
  init
}