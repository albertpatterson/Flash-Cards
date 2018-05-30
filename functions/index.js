'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const express = require('express');
const cookieParser = require('cookie-parser')();
const cors = require('cors')({origin: true});
const app = express();

const validateFirebaseIdToken = (req, res, next) => {
  console.log('Check if request is authorized with Firebase ID token');

  if ((!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) &&
    !(req.cookies && req.cookies.__session)) {
    console.error('No Firebase ID token was passed as a Bearer token in the Authorization header.',
      'Make sure you authorize your request by providing the following HTTP header:',
      'Authorization: Bearer <Firebase ID Token>',
      'or by passing a "__session" cookie.');
    res.status(403).send('Unauthorized');
    return;
  }

  let idToken;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    console.log('Found "Authorization" header');
    idToken = req.headers.authorization.split('Bearer ')[1];
  } else if(req.cookies) {
    console.log('Found "__session" cookie');
    idToken = req.cookies.__session;
  } else {
    res.status(403).send('Unauthorized');
    return;
  }

  admin.auth().verifyIdToken(idToken).then((decodedIdToken) => {
    console.log('ID Token correctly decoded', decodedIdToken);
    req.user = decodedIdToken;
    return next();
  }).catch((error) => {
    console.error('Error while verifying Firebase ID token:', error);
    res.status(403).send('Unauthorized');
  });
};

app.use(cors);
app.use(cookieParser);
app.use(validateFirebaseIdToken);
app.get('/recents', (req, res) => {

  const item = req.query.item;
  const uid = req.user.uid;

  return admin.database().ref(`/recents/${uid}`).orderByKey().once("value")
    .then((snapshot) => {

      if(snapshot.exists()){

        let lastKey;
        let remove = Promise.resolve();
        snapshot.forEach(childSnapshot=>{
          lastKey = childSnapshot.key;
          if(childSnapshot.val() === item){
            remove = admin.database().ref(`/recents/${uid}/${childSnapshot.key}`).remove();
          }
        });

        const newKey = Number.parseInt(lastKey)+1;
        const add = admin.database().ref(`/recents/${uid}/${newKey}`).set(item);

        return Promise.all([remove, add])

      }else{
        return admin.database().ref(`/recents/${uid}/0`).set(item);
      }
    })
    .then(()=>res.sendStatus(204))
    .catch(e=>res.status(500).send(e));
});

exports.app = functions.https.onRequest(app);