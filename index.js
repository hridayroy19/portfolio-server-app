require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB Connection URL
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    // Connect to MongoDB
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db("portfolio");
    const collection = db.collection("blog");
    const message = db.collection("message");

    app.post("/api/blog", async (req, res) => {
      const blogData = req.body;
      console.log(blogData);

      const result = await collection.insertOne(blogData);
      res.status(201).json({
        success: true,
        message: "User registered successfully!",
        data: result,
      });
    });

    app.get("/api/blog", async (req, res) => {
      try {
        const result = await collection.find({}).toArray();
        res.status(200).json({
          success: true,
          message: "Blogs fetched successfully!",
          data: result,
        });
      } catch (error) {
        console.error("Error fetching blogs:", error);
        res.status(500).json({
          success: false,
          message: "Error fetching blogs",
        });
      }
    });

    app.get("/api/blog/:blogId", async (req, res) => {
      const blogId = req.params.blogId;
      const filter = { _id: new ObjectId(blogId) };
      const result = await collection.findOne(filter);
      res.send(result);
    });

    app.delete("/api/blog/:blogId", async (req, res) => {
      const blogId = req.params.blogId;
      const filter = { _id: new ObjectId(blogId) };

      try {
        const result = await collection.findOneAndDelete(filter);

        res
          .status(200)
          .json({ success: true, message: "Blog deleted successfully!" });
      } catch (error) {
        console.error("Error deleting blog:", error);
        res
          .status(500)
          .json({ success: false, message: "Error deleting blog" });
      }
    });

    // message api
    app.post("/api/message", async (req, res) => {
      const messageData = req.body;
      console.log(messageData);

      const result = await message.insertOne(messageData);
      res.status(201).json({
        success: true,
        message: "Message send successfully!",
        data: result,
      });
    });

    app.get("/api/message", async (req, res) => {
      try {
        const result = await message.find({}).toArray();
        res.status(200).json({
          success: true,
          message: "message fetched successfully!",
          data: result,
        });
      } catch (error) {
        console.error("Error fetching message:", error);
        res.status(500).json({
          success: false,
          message: "Error fetching blogs",
        });
      }
    });

    // Start the server
    app.listen(port, () => {
      console.log(`Server is running on 🏃🏿‍➡️  http://localhost:${port}`);
    });
  } finally {
  }
}

run().catch(console.dir);

// Test route
app.get("/", (req, res) => {
  const serverStatus = {
    message: "Server is running smoothly 🏃🏿‍➡️ ",
    timestamp: new Date(),
  };
  res.json(serverStatus);
});
