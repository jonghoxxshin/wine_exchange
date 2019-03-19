const express = require('express');
const bodyParser = require("body-parser");
const path = require('path');
const cors = require('cors');
const UserCollection = require("./db/postCollection");
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const connectionString = "mongodb+srv://abc123:shin01@cluster0-an6d6.mongodb.net/test?retryWrites=true";

const app = express();
const port = process.env.port || 8000;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

(async () => {
    const cli = await new MongoClient(connectionString, {useNewUrlParser: true}).connect();
    const postCollection = await UserCollection.getPostCollection(cli);

    app.get('/', async (req, res) => {
        // if(req.query.email) {
        //     const data = await collection.findOne({email: req.query.email});
        //     res.render('pages/index', {id: data._id, hiMessage: data.email})
        // } else {
        //     res.render('pages/index', {id: "stranger", hiMessage: "stranger"})
        // }

        res.render('index',{list: await postCollection.find({}).toArray()});
        //res.send(await collection.find({}).toArray());
    });


    app.delete('/:id', async (req, res)=>{
        try{
            await postCollection.deleteOne({
                _id: new mongodb.ObjectID(req.params.id)
            });
            res.status(200).send();
        }catch (e) {
            console.log(e);
        }
    });

    app.get('/:id', async(req, res)=>{
        try{

        }catch(e){

        }
    });

    app.get('/newPost', async (req, res)=>{
        res.render('newPost');
    });

    app.post('/newPost', async (req,res)=>{
        try{
            await postCollection.insertOne({
                text:req.body.text,
                name:req.body.name,
                year:req.body.year,
                date: new Date()
            });
            res.redirect("/");
        }catch (e) {
            console.log(e);
        }
    });
    //
    // app.post('/delete', async (req, res) => {
    //     try {
    //         await collection.deleteMany({email: req.body.email});
    //         res.send();
    //     } catch (e) { res.status(404).send(e); }
    // });
    //
    // app.post('/addOne', async (req, res) => {
    //     try {
    //         console.log(req.body);
    //         await collection.insertOne({ email: req.body.email });
    //         res.send();
    //     } catch (e) { res.status(404).send(e); }
    // });
    app.listen(port, () => console.log(`Example app listening on port ${port}!`));
})();