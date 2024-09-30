const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("../Major Project/models/listing.js");

const port = 8080;
const MONGO_URL = "mongodb://127.0.0.1:27017/Traveller";

// Connecting to MongoDB
main()
    .then(() => {
        console.log("Connected to DB");
    })
    .catch((err) => {
        console.error("Error connecting to DB:", err);
    });

async function main() {
    await mongoose.connect(MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
}

// Test route
app.get("/", (req, res) => {
    res.send("Hello World");
});

// Route to test listing creation
app.get("/testListing", async (req, res) => {
    try {
        let sampleListing = new Listing({
            title: "My new Villa",
            description: "By the beach",
            price: 1200,
            location: "Lonavala, Maharashtra",
            country: "India",
        });
        
        await sampleListing.save(); // Save the listing to the database
        console.log("Sample listing was saved");

        res.status(201).send("Sample listing was successfully saved");
    } catch (err) {
        console.error("Error saving sample listing:", err);
        res.status(500).send("Error saving sample listing");
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
