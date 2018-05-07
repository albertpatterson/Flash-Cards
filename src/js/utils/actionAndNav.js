let actions = {};
let nav = null;
let showErrorReport = null;
let resetErrorReport = null;

let actionAndNav = {
  addActions: function(_actions){
    Object.assign(actions, _actions);
  },

  init: function(_nav, _showErrorReport, _resetErrorReport){
    nav=_nav;
    showErrorReport = _showErrorReport;
    resetErrorReport = _resetErrorReport;

    let els = document.querySelectorAll("[data-nav], [data-action]");
    [].forEach.call(els, el=>{
      let actionName=el.dataset.action;
      let nextId=el.dataset.nav
      if(actionName && nextId){
        el.onclick = function(){
          disableActionAndNav()
          actions[actionName]()
          .then(resetErrorReport(el))
          .catch(e=>showErrorReport(e, el))
          .then(go=>go&&nav(nextId))
          .then(enableActionAndNav);
        }
      }else if(actionName){
        el.onclick = function(){
          disableActionAndNav()
          actions[actionName]()
          .then(resetErrorReport(el))
          .catch(e=>showErrorReport(e, el))
          .then(enableActionAndNav);
        };
      }else{
        el.onclick=()=>nav(nextId);
      }
    })
  }
}

function disableActionAndNav(){
  [].forEach.call(document.querySelectorAll("[data-action], [data-nav]"),el=>{el.disabled=true});
}

function enableActionAndNav(){
  [].forEach.call(document.querySelectorAll("[data-action], [data-nav]"),el=>{el.disabled=false});
}

module.exports = actionAndNav;