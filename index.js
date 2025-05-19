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

        app.get("/coffees", async(req, res) => {
          const result= await coffeeCollection.find().toArray();
          res.send(result);
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