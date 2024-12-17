const express= require("express");
const app=express();
const mongoose = require("mongoose");
const Listing = require("../Major Project/models/listing.js")
const path = require("path");
const methodOverride=require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");

const port = 8080;

const MONGO_URL="mongodb://127.0.0.1:27017/Traveller";

main()
    .then(()=>{
        console.log("Connected to DB");
    })
    .catch((err)=>{
        console.log(err);
    }); 

async function main(){
    await mongoose.connect(MONGO_URL);
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);   
app.use(express.static(path.join(__dirname,"/public")));

app.get("/",(req,res)=>{
    res.send("Hello World");
});

//Index Route
app.get("/Listings",async(req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}); 

//New Route
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
});

//Show Route
app.get("/listings/:id",async(req,res)=>{
    let {id}=req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs",{listing});
});

//create Route
app.post("/listings",
    wrapAsync(async(req,res,next)=>{
        const newlisting = new Listing(req.body.listing);
        await newlisting.save();
        res.redirect("/listings");  
}));

//Edit Route
app.get("/listings/:id/edit",async(req,res)=>{
    let {id}=req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
});

//Update Route
app.put("/listings/:id", async (req,res)=>{
    let{id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
});

//Delete Route
app.delete("/listings/:id", async(req,res)=>{
    let{id}=req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
})
// app.get("/testListing",async(req,res)=>{
//     let sampleListings = new Listing({
//         title:"My new Villa",
//         discription:"By the beach",
//         price:1200,
//         location:"Lonawala,Maharashtra",
//         country:"India",    
//     });
//     await sampleListings.save();
//     console.log("sample was saved");
//     res.send("Successful Testing");
// });

app.use((err,req,res,next)=>{
    res.send("something went wrong");
})

app.listen(port,()=>{
    console.log(`Port ${port} is started`);
})