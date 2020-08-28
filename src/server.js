const express = require('express');

const app = new express;

var admin = require("firebase-admin");

var serviceAccount = require("../key/messenger-b9792-firebase-adminsdk-tcoze-8379eed6c4.json");
const bodyParser = require('body-parser');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://messenger-b9792.firebaseio.com"
});


const db = admin.firestore();
const itemRef = db.collection('shop-item');
app.use(require('body-parser')());





//ping 
app.get('/ping', async (req, res) => {
    res.send({ 'message': 'Hello World' });
})

app.get('/ping/:id', (req, res) => {
    res.send('Hello World!' + req.params.id)
})

app.get("/item", async (req, res) => {
    let listOfItemRef = await db.collection("shop-item").listDocuments();
    let listOfItem = [];
    for (const eachitem of listOfItemRef) {
        let item = (await eachitem.get()).data();
        listOfItem.push(item);
    }
    res.send(listOfItem)
})



app.post('/itemRef', async (req, res) => {
    try {
        await db.collection('shop-item').add(req.body);
        res.send({
            status: "Create Shop Successful!!!"
        })
    }
    catch (err) {
        res.send(err)({
            status: "Create Fail !!!!!"
        })
    }
})

app.put('/put/:id', async (req, res) => {
    const { id } = req.params;
    if (id == undefined) {
        res.send({
            Status: " Set the item id"
        });
        return;
    }
    let doc = admin.firestore().collection('shop-item').doc(id);
    if ((await doc.get()).exists) {
        if (id == req.body.id) {
            try {
                await doc.set(req.body);
                res.send({
                    status: "Update Successfully !!!!!"
                });
                return;
            } catch (err) {
                res.send({
                    status: "Update fail !!!!!"
                });
            }
        }
        res.send({
            status: "id is not match"
        });
        return;
    }
    res.send({
        status: " id not exist"
    });
})

app.delete('/delete/:id', async (req, res) => {
    let id = req.params.id;
    try {
        await db.collection('shop-item').doc(id).delete();
        res.send({
            status: "Delete successful !!!!"
        })
    }
    catch (err) {
        res.send(err)({
            status: "Delete Fail !!!!"
        })
    }
})



//port
app.listen(6969, "127.0.0.1", () => {
    console.log("Sever is running");
});
