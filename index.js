const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
require('dotenv').config()
const MongoClient = require('mongodb').MongoClient;
const { ObjectId } = require('bson');

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lqubf.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()
app.use(cors())
app.use(bodyParser.json())




const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const beverageCollection = client.db(`${process.env.DB_NAME}`).collection(`${process.env.DB_COLLECTION}`);
  const ordersCollection = client.db(`${process.env.DB_NAME}`).collection(`order`);
  
  // add beverage to database
  app.post('/addBeverage', (req, res) => {
    const newEvent = req.body;
    console.log('add', newEvent);
    beverageCollection.insertOne(newEvent)
    .then(result => {
      console.log(result)
      res.send(result.insertedCount > 0)
    })
  })

  // add orders to database
  app.post('/addOrder', (req, res) => {
    const order = req.body;
    ordersCollection.insertOne(order)
        .then(result => {
            console.log("happy: ",result.insertedCount > 0);
        })
})

   // read all from database
   app.get('/beverages', (req, res) => {
    beverageCollection.find()
    .toArray( (err, documents) => {
      res.send(documents);
    })
  })

  // read one(individual id) beverage from database
  app.get('/beverage/:id', (req, res) => {
    beverageCollection.find({_id: ObjectId(req.params.id)})
    .toArray( (err, documents) => {
      res.send(documents[0])
    })
  })

  // read some(matched email) from database
  app.get('/orders/:email', (req, res) => {
    ordersCollection.find({email: req.params.email})
    .toArray( (err, documents) => {
      console.log("docss: ",documents)
      res.send(documents)
    })
  })

  
//   client.close();
});



app.get('/', (req, res) => {
  res.send('Welcome to Beverage Store!')
})

const port = process.env.PORT || 5055;
app.listen(port)