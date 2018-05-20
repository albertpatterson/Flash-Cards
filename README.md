# Flash-Cards
An app for creating interactive flashcards from a list of terms saved in a Google Sheets spreadsheet document, allowing users to create flashcards from public lists or their own private lists.
## How to use
1. Find the app at https://flashcards-6c206.firebaseapp.com/ hosted via Firebase
    1. The app is not yet verified (work in progress)
    2. it currently only supports phones in portrait disiplay
    3. Overall the app is very rough but does off the basic functionality described
2. Sign in with Google, which allows the app to locate and read saved word lists
3. optional steps
    1. Create your own lists
        1. Create a Google Sheets spreadsheet document: https://www.google.com/sheets/about/
        2. Add terms
            * one term per row
            * first column: hanzi
            * second column: pinyin
            * third column: english
        3. Give each sheet a meaningful name (tabs at the bottom of the page represent sheets). The app will regard each sheet as a different term list. See https://docs.google.com/spreadsheets/d/1af9vsz-qcJooeql9yGn0TjOGGTE3amVIRm-Yu_y4bLU as an example
    2. Consider sharing your term lists
        1. Share the app to allow anyone with the link to view the document
        2. Email the link to the spreadsheet document to apatterson189@gmail.com
## How to install and run
1. Clone this repo
2. `> npm install`
3. Create your own project and setup OAuth 2.0 as described at https://developers.google.com/identity/protocols/OpenIDConnect
4. upadte src/assets/app.js to use your own project information  
5. development
    1. build 
        * Unix: `$> npm run build`
        * Windows: `> npm run buildw`
    2. webpack dev serve: `> npm run dev`
    * optional: serve using firebase configuration
        1. `> npm install -g firebase-tools`
        2. `> firebase serve`

