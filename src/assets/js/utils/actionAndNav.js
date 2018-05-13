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

    let els = document.querySelectorAll("[data-nav], [data-action], [data-actionsync]");
    [].forEach.call(els, el=>{
      let actionName=el.dataset.action;
      let syncActionName=el.dataset.actionsync;
      let nextId=el.dataset.nav
      const interaction = getInteraction(el);

      if(actionName){
     
        el[interaction] = function(event){
          disableActionAndNav()
          actions[actionName](event)
          .then(resetErrorReport(el))
          .catch(e=>showErrorReport(e, el))
          .then(go=>go&&nextId&&nav(nextId))
          .then(enableActionAndNav);
        }
      }else if(syncActionName){
        el[interaction] = function(event){
          try{
            const go = actions[syncActionName](event);
            go && nextId && nav(nextId);
          }catch(e){
            showErrorReport(e, el)
          }
        };
      }else{
        el[interaction]=()=>nav(nextId);
      }
    })
  }
}

function getInteraction(el){
  const tag = el.tagName; 
  switch(tag){
    case "BUTTON":
      return "onclick";
    case "SELECT":
      return "onchange";
    case "INPUT":
      return "onkeyup";
    default:
      throw new Error("Unknown interaction for "+tag);
  }
}

function disableActionAndNav(){
  [].forEach.call(document.querySelectorAll("[data-action], [data-nav]"),el=>{el.disabled=true});
}

function enableActionAndNav(){
  [].forEach.call(document.querySelectorAll("[data-action], [data-nav]"),el=>{el.disabled=false});
}

module.exports = actionAndNav;