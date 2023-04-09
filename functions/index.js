const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors")({ origin: true });

admin.initializeApp();
admin.firestore().settings({ timestampsInSnapshots: true });

exports.saveUserData = functions.https.onRequest((req, res) => {
    console.log("req.body", req.body)
    cors(req, res, () => {
        const name = req.body.name || 'Anonymous';
        const email = req.body.email || 'Anonymous@Anonymous.com';
        const phone = req.body.phone || '1111111111';

        if (!name || !email || !phone) {
            res.status(400).send('Missing required fields');
            return;
        }

        admin.firestore()
            .collection('users')
            .add({
                name: name,
                email: email,
                phone: phone,
                date: new Date()
            })
            .then((docRef) => {
                console.log('Document written with ID: ', docRef.id);
                res.status(200).send('User data saved successfully');
            })
            .catch((error) => {
                console.error('Error adding document: ', error);
                res.status(500).send('Error saving user data');
            });
    });
});