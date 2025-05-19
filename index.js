const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()

const uri = `mongodb+srv://mirul-moktadir:${process.env.DB_PASSWORD}@cluster0.mnwmrsu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


app.use(cors());
app.use(express.json());

async function run () {
    try {
        await client.connect();

        const coffeeCollection = client.db('coffeeDB').collection('coffeeCollection');
        const userCollection = client.db("coffeeDB").collection('userCollection');

        app.get("/coffees", async(req, res) => {
          const result= await coffeeCollection.find().toArray();
          res.send(result);
        })

        app.get("/users", async(req, res) => {
          const result = await userCollection.find().toArray();
          res.send(result);
        })
        app.post("/users", async(req, res) => {
          const doc = req.body;
          const result = await userCollection.insertOne(doc);
          res.send(result);
          console.log(result);
        })

        app.get("/coffees/:id", async(req, res) => {
          const id = req.params.id;
          const query = {_id: new ObjectId(id)};
          const result = await coffeeCollection.findOne(query);
          res.send(result);
          console.log(result);
        })

        app.post("/coffees", async(req, res) => {
            const doc = req.body;
            const result = await coffeeCollection.insertOne(doc);
            console.log(result)
            res.send(result)
        })

        app.put("/coffees/:id", async(req, res) => {
          const id = req.params.id;
          const filter = {_id: new ObjectId(id)};
          const change = req.body;
          const updatedDoc = {
            $set: {
              coffee: change.coffee,
              barista: change.barista,
              supplier: change.supplier,
              taste: change.taste,
              details: change.details,
              photoUrl: change.photoUrl
            }
          };
          const result = await coffeeCollection.updateOne(filter, updatedDoc);
          res.send(result);
          console.log(result)
        })

        app.delete("/coffees/:id", async(req, res) => {
          const id = req.params.id;
          const query = {_id: new ObjectId(id)};
          const result = await coffeeCollection.deleteOne(query);
          console.log(result);
          res.send(result);
        })

        await client.db('admin').command({ping : 1})
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    }
    finally {

    }
}

run().catch(console.dir)

app.listen(port, () => {
    console.log(`Coffee store server is running: ${port}`)
})