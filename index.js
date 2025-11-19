const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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

async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Connected to MongoDB");

    const database = client.db("rent-wheels-DB");

    const carsCollection = database.collection("cars");
    const userCollection = database.collection("users");
    const bookingCollection = database.collection("bookings");
    const testimonialCollection = database.collection("testimonials");

    // TESTIMONiAL API
    app.get("/testimonials", async (req, res) => {
      const cursor = testimonialCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // USER API
    app.post("/users", async (req, res) => {
      const newUser = req.body;
      const email = req.body.email;
      const query = { email: email };

      const existingUser = await userCollection.findOne(query);

      if (existingUser) {
        res.json({
          success: true,
          message: "User already exists",
          user: existingUser,
        });
      } else {
        const result = await userCollection.insertOne(newUser);
        res.send(result);
      }
    });

    // BOOKING API
    app.get("/bookings", async (req, res) => {
      const email = req.query.email;
      const query = email ? { user_email: email } : {};

      const cursor = bookingCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.post("/bookings", async (req, res) => {
      const newBooking = req.body;
      const result = await bookingCollection.insertOne(newBooking);
      res.send(result);
    });

    app.delete("/bookings/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };

      const result = await bookingCollection.deleteOne(query);
      res.send(result);
    });

    app.patch("/bookings/:id", async (req, res) => {
      const id = req.params.id;
      const updatedData = req.body;

      const query = { _id: new ObjectId(id) };
      const updateDoc = { $set: updatedData };

      const result = await bookingCollection.updateOne(query, updateDoc);
      res.send(result);
    });

    // CAR API
    app.get("/cars", async (req, res) => {
      const email = req.query.email;
      const query = email ? { "provider.email": email } : {};

      const cursor = carsCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/cars/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await carsCollection.findOne(query);
      res.send(result);
    });

    app.get("/featured-cars", async (req, res) => {
      const cursor = carsCollection.find().limit(6).sort({ added_time: -1 });
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/browse-cars", async (req, res) => {
      const cursor = carsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.post("/add-car", async (req, res) => {
      const newCar = req.body;
      const result = await carsCollection.insertOne(newCar);
      res.send(result);
    });

    app.delete("/cars/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };

      const result = await carsCollection.deleteOne(query);
      res.send(result);
    });

    app.patch("/cars/:id", async (req, res) => {
      const id = req.params.id;
      const updatedData = req.body;

      const query = { _id: new ObjectId(id) };
      const updateDoc = { $set: updatedData };

      const result = await carsCollection.updateOne(query, updateDoc);
      res.send(result);
    });

    app.patch("/cars/book/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };

      const update = {
        $set: { status: "unavailable" },
      };

      const result = await carsCollection.updateOne(query, update);
      res.send(result);
    });

    app.patch("/cars/cancel/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };

      const updateDoc = {
        $set: { status: "available" },
      };

      const result = await carsCollection.updateOne(query, updateDoc);
      res.send(result);
    });
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Rental Server is Running");
});

app.listen(port, () => {
  console.log("Server is running on port", port);
});
