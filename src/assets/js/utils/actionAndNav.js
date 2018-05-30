const view = require("../utils/view");

const actions = {};
const nav = view.showExclusive;

let els = document.querySelectorAll("[data-nav], [data-action], [data-actionsync]");
[].forEach.call(els, el=>{
  let actionName=el.dataset.action;
  let syncActionName=el.dataset.actionsync;
  let nextId=el.dataset.nav;
  const interaction = getInteraction(el);

  if(actionName){
  
    el[interaction] = function(event){
      disableActionAndNav();
      actions[actionName](event)
      .then(()=>resetErrorReport(el))
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

function showErrorReport(error, el){
  let errorWrapper = getErrorWrapper(el);
  if(errorWrapper){
    errorWrapper.innerText = error.message;
    view.show(errorWrapper)
  }
  return Promise.resolve(false);
}

function resetErrorReport(el){
  let errorWrapper = getErrorWrapper(el);
  if(errorWrapper){
    errorWrapper.innerText = "";
    view.unshow(errorWrapper)
  }
  return Promise.resolve(true);
}

function getErrorWrapper(actionEl){
  let actionName = actionEl.dataset.action;
  let checkEl = actionEl.parentElement;
  while(checkEl && !checkEl.classList.contains("modal-content")) checkEl=checkEl.parentElement;
  if(checkEl){
    let errorWrapper = document.querySelector(`[data-error="${actionName}"]`);
    if(!errorWrapper) console.warn("No error wrapper found for action "+actionName);
    return errorWrapper;
  }else{
    console.error("No modal-content parent found for action "+actionName);
    return null;
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

const actionAndNav = {
  addActions: function(_actions){
    Object.assign(actions, _actions);
  }
}

module.exports = actionAndNav;