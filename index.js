var express = require ('express');
var app = express()

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://linhson:257000linhson@cluster0.02mmw.mongodb.net/test";

var publicDir = require('path').join(__dirname,'/public');
app.use(express.static(publicDir));

var hbs = require('hbs')
app.set('view engine','hbs')

var bodyParser = require("body-parser")
app.use(bodyParser.urlencoded({extented: false}))


app.get('/', async(req, res)=>{
    let client= await MongoClient.connect(url);
        let dbo = client.db("NgoLinhSonDB");
        let results = await dbo.collection("Product").find({}).toArray();
        res.render('home', {model: results});
})

app.get('/addProduct', (req,res)=>{
    res.render('addProduct')
})

// app.post('/insert', async (req,res)=>{
//     let client= await MongoClient.connect(url, {useUnifiedTopology: true});
//     let dbo = client.db('ProductTesting'); 
//     let Name = req.body.productName;
//     let Price = req.body.price;
//     let Date = req.body.ImportedDate;
//     let Clothes = req.body.outfit;
//     let Image = req.body.img;
//     let newProduct = {productName: Name, price: Price, ImportedDate: Date, outfit: Clothes, img: Image};
//     await dbo.collection('ProductTesing').insertOne(newProduct);
    
//     res.redirect('/viewproducts')  
// })

app.post('/addProduct', async(req, res)=>{
    let client = await MongoClient.connect(url);
    let dbo = client.db("NgoLinhSonDB");
    let name = req.body.Name;
    let color = req.body.Color;
    let amount = req.body.Amount;
    let picture = req.body.Picture;
    let price = req.body.Price;
    let newProduct = {Name: name,Color: color, Amount: amount, Picture: picture, Price: price, };
    await dbo.collection('Product').insertOne(newProduct);
    res.redirect('/');
})

// app.get("/delete", async(req, res)=>{
//     let id = req.query.id;
//     var ObjectID = require("mongodb").ObjectID;
//     let condition = {_id: ObjectID(id) };
//     let client= await MongoClient.connect(url, {useUnifiedTopology: true});
//     let dbo = client.db("ProductTesting");
//     await dbo.collection("ProductTesing").deleteOne(condition);
//     let results = await dbo.collection("ProductTesing").find({}).toArray({});
//     res.redirect('/')
// });

app.get("/delete", async(req, res)=>{
    let id = req.query.id;
    var ObjectID = require("mongodb").ObjectID;
    let condition ={_id: ObjectID(id)};
    let client = await MongoClient.connect(url);
    let dbo = client.db("NgoLinhSonDB");
    await dbo.collection("Product").deleteOne(condition);
    let results = await dbo.collection("Product").find({}).toArray({});
    res.redirect('/')
})

// app.post('/search', async(req, res)=>{
//     let searchText = req.body.txtSearch;
//     let client= await MongoClient.connect(url, {useUnifiedTopology: true});
//     let dbo = client.db("ProductTesting");
//     let results = await dbo.collection("ProductTesing"). find({productName: new RegExp(searchText, 'i')}).toArray();
//     res.render('viewproducts',{model: results})

app.post('/search', async(req, res)=>{
    let searchText = req.body.txtSearch;
    let client = await MongoClient.connect(url)
    let dbo = client.db("NgoLinhSonDB");
    let results = await dbo.collection("Product").find({Name: new RegExp(searchText, 'i')}).toArray();
    res.render('home',{model: results} )
})

var PORT = process.env.PORT || 2570
app.listen(PORT);

console.log("server is running at "+ PORT)