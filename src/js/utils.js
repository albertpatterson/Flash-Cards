module.exports = {
  
  show: function(el){
    el.classList.add("showing");
  },

  unshow: function(el){
    el.classList.remove("showing");
  },

  showExclusive: function(id){
    let showingContents = document.getElementsByClassName("modal-content");
    [].forEach.call(showingContents, e=>e.classList.remove("showing"));
    document.getElementById(id).classList.add("showing");
  }


}