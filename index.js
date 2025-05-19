require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();

// ✅ CORS Setup
const corsOptions = {
  origin: ['https://recat-knowledge-cafe.web.app'], // your frontend domain
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());

// ✅ MongoDB Setup
const uri = `mongodb+srv://mirul-moktadir:${process.env.DB_PASSWORD}@cluster0.mnwmrsu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    const coffeeCollection = client.db('coffeeDB').collection('coffeeCollection');
    const userCollection = client.db("coffeeDB").collection('userCollection');

    app.get("/coffees", async (req, res) => {
      const result = await coffeeCollection.find().toArray();
      res.send(result);
    });

    app.get("/coffees/:id", async (req, res) => {
      const id = req.params.id;
      const result = await coffeeCollection.findOne({ _id: new ObjectId(id) });
      res.send(result);
    });

    app.post("/coffees", async (req, res) => {
      const result = await coffeeCollection.insertOne(req.body);
      res.send(result);
    });

    app.put("/coffees/:id", async (req, res) => {
      const id = req.params.id;
      const updatedDoc = {
        $set: {
          ...req.body
        }
      };
      const result = await coffeeCollection.updateOne(
        { _id: new ObjectId(id) },
        updatedDoc
      );
      res.send(result);
    });

    app.delete("/coffees/:id", async (req, res) => {
      const id = req.params.id;
      const result = await coffeeCollection.deleteOne({ _id: new ObjectId(id) });
      res.send(result);
    });

    // Users
    app.get("/users", async (req, res) => {
      const result = await userCollection.find().toArray();
      res.send(result);
    });

    app.post("/users", async (req, res) => {
      const result = await userCollection.insertOne(req.body);
      res.send(result);
    });

    // Root
    app.get("/", (req, res) => {
      res.send("Coffee server running and CORS configured.");
    });
  } catch (err) {
    console.error(err);
  }
}

run().catch(console.dir);

// ✅ Vercel requires export, NOT app.listen
module.exports = app;
