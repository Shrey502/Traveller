const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/Traveller";

async function main() {
    try {
        await mongoose.connect(MONGO_URL);
        console.log("Connected to DB");
        
        await initDB();
    } catch (err) {
        console.error("Error connecting to the database:", err);
    }
}

const initDB = async () => {
    try {
        await Listing.deleteMany({}); 
        initData.data=initData.data.map((obj)=>({...obj,owner:"67f5351ceccd2a3cb73e5a44"}));
        await Listing.insertMany(initData.data);
        console.log("Data was initialized");
    } catch (err) {
        console.error("Error initializing data:", err);
    }
};

main();
