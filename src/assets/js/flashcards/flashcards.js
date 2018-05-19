const flashcardsModel = require("./flashcardsModel");
const flashcardsController = require("./flashcardsController");

module.exports = {
  start: function(settings, terms){
    flashcardsModel.start(terms);
    flashcardsController.start(settings);
  },
  skip: flashcardsController.skip
}