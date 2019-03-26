const initializePassport = require('./config/passport').initializePassport;
const express = require('express');
const bodyParser = require("body-parser");
const path = require('path');
const cors = require('cors');
const PostCollection = require("./db/postCollection");
const UserCollection = require("./db/userCollection");
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const ObjectId = require('mongodb').ObjectID;




const connectionString = "mongodb+srv://abc123:shin01@cluster0-an6d6.mongodb.net/test?retryWrites=true";

const app = express();
const port = process.env.port || 8000;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret : "cats"}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

(async () => {
    const cli = await new MongoClient(connectionString, {useNewUrlParser: true}).connect();
    const postCollection = await PostCollection.getPostCollection(cli);
    const userCollection = await UserCollection.getUserCollection(cli);
    initializePassport(userCollection);

    app.get('/', async (req, res) => {
        console.log(req.user);
        res.render('index',{list: await postCollection.find({}).toArray()});
        //res.send(await collection.find({}).toArray());
    });
    app.get('/newPost', async (req, res)=>{
        res.render('newPost');
    });
    app.get('/loginPage', async(req, res)=>{
        res.render('loginPage');
    });

    app.get('/logout', async(req, res) => {
        req.logout();
        res.redirect('/');
    });

    app.get('/createNewAccount', async(req, res)=>{
        res.render('createNewAccount');
    });

    app.post('/createNewAccount', async(req, res)=> {
        try {
            await userCollection.insertOne(
                {
                    email: req.body.email,
                    username: req.body.username,
                    password: req.body.password
                });
            res.redirect('/');
        } catch (err) {
            console.log(err);
            res.status(404).send();
        }
    });

    app.post('/login',
            passport.authenticate('local', {successRedirect : '/',
                failureRedirect:'/',
                failureFlash : true,
                successFlash : 'welcome!'}));

    //
    app.get('/post/:postid', async(req, res)=>{
        postCollection.findOne({_id: ObjectId(req.params.postid)}, (err, post) => {
            if(err) {
                res.redirect("fucked");
            } else {
                res.render('postPage', { post: post });
            }
        });
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
    //         portawait collection.insertOne({ email: req.body.email });
    //         res.send();
    //     } catch (e) { res.status(404).send(e); }
    // });
    app.listen(port, () => console.log(`Example app listening on port ${port}!`));
})();