const exclusiveViewClasses = ["modal", "modal-content"];
module.exports = {
  
  show: function(identifier){
    const el = typeof identifier === "string" ? document.getElementById(identifier) : identifier;
    el.classList.add("showing");
  },

  unshow: function(identifier){
    const el = typeof identifier === "string" ? document.getElementById(identifier) : identifier;
    el.classList.remove("showing");
  },

  showExclusive: function(identifier){

    const el = typeof identifier === "string" ? document.getElementById(identifier) : identifier;
  
    const exclusiveViewClass = exclusiveViewClasses.find(c=>el.classList.contains(c));
    if(!exclusiveViewClass) return
    
    let showingContents = document.getElementsByClassName(exclusiveViewClass);
    [].forEach.call(showingContents, e=>e.classList.remove("showing"));
    el.classList.add("showing");
  }
}