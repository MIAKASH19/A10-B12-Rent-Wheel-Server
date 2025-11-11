const { MongoClient, ServerApiVersion } = require("mongodb");
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// URI
const uri =
  "mongodb+srv://rent-wheelsDBuser:r6EI5vdrU8zUoubW@cluster0.9sqbqr2.mongodb.net/?appName=Cluster0";

// Connect To Database
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// rent-wheelsDBuser
// r6EI5vdrU8zUoubW

async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    const database = client.db("rent-wheels-DB")

    const carsCollection = database.collection("cars")


    app.get("/cars", async (req, res)=>{
        const cursor = carsCollection.find().limit(6)
        const result = await cursor.toArray()
        res.send(result)
    })


  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Rental Server is Running");
});

app.listen(port, () => {
  console.log("Server is running");
});
