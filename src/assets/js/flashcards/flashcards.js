import flashcardsController from './flashcardsController';
import flashcardsModel from './flashcardsModel';

export default {
  start:
      function(settings, terms) {
        flashcardsModel.start(terms);
        flashcardsController.start(settings);
      },
  skip: flashcardsController.skip
}