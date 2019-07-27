const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);
let db = admin.firestore();



// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {

 });

 exports.sendVerificationCode = functions.https.onRequest((request, response) => {
    const accountSid = 'AC4f9253cebc7c889a89d6b449e701bfa7';
    const authToken = '96e434831128d8cb7cf27212a7ca08df';
    const client = require('twilio')(accountSid, authToken);

    response.set('Access-Control-Allow-Origin', "*")
    response.set('Access-Control-Allow-Methods', 'GET, POST')

    const randomNumber = Math.floor(1000 + Math.random() * 9000);

    let docRef = db.collection('verification-codes').doc(request.query.pn);

    let setDoc = docRef.set({
        code: randomNumber,
    });

    client.messages
    .create({
        body: `Your Friends That Match Verification Code is ${randomNumber}`,
        from: '+14702645321',
        to: `${request.query.pn}`
    })
    .then(message => console.log(message.sid)).then(res => response.send(200)).catch(err => console.log(err));
 });

 exports.checkVerificationCode = functions.https.onRequest((request, response) => {
    response.set('Access-Control-Allow-Origin', "*")
    response.set('Access-Control-Allow-Methods', 'GET, POST')

    let docRef = db.collection('verification-codes').doc(request.query.pn);
    let getDoc = docRef.get()
  .then(doc => {
    if (request.query.vc*1 === doc.data().code*1) {
        response.status(200).send({"data": Date.now()})
    } else {
        response.status(401).send()
    }

    return 500
 }).catch(err => console.log(err))})

 exports.addPhoneNumber = functions.https.onRequest((request, response) => {
  response.set('Access-Control-Allow-Origin', "*")
  response.set('Access-Control-Allow-Methods', 'GET, POST')

  admin.auth().updateUser(request.query.uid, {
      phoneNumber: `+${request.query.pn}`,
    })
      .then(function(userRecord) {
        // See the UserRecord reference doc for the contents of userRecord.
        console.log('Successfully updated user', userRecord.toJSON());
        return;
      })
      .catch(function(error) {
        console.log(request.query.pn, 'Error updating user:', error);
      });

  response.status(200).send({"data": Date.now()})

})

