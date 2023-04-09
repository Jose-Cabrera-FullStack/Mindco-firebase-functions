const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors")({ origin: true });

admin.initializeApp();
admin.firestore().settings({ timestampsInSnapshots: true });

exports.helloWorld = functions.https.onRequest((request, response) => {
    functions.logger.info("Hello logs!", { structuredData: true });
    response.send("Hello from Firebase!");
});

// saveUserData({name: "John", email: "gmail@gmail.com", phone: "2222222222" })

exports.saveUserData = functions.https.onRequest((req, res) => {
    console.log("Request body: ", req.body)
    cors(req, res, () => {
        const name = req.body?.data?.name || "Anonymous";
        const email = req.body?.data?.email || "Anonymous@Anonymous.com";
        const phone = req.body?.data?.phone || "1111111111";

        if (!name || !email || !phone) {
            res.status(400).send("Missing required fields");
            return;
        }

        admin
            .firestore()
            .collection("users")
            .add({
                name: name,
                email: email,
                phone: phone,
                date: new Date(),
            })
            .then((docRef) => {
                console.log("Document written with ID: ", docRef.id);
                res.status(200).send("User data saved successfully");
            })
            .catch((error) => {
                console.error("Error adding document: ", error);
                res.status(500).send("Error saving user data");
            });

    });
});