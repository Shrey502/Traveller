const express= require("express");
const app=express();
const mongoose = require("mongoose");
const Listing = require("../Major Project/models/listing.js")
const path = require("path");
const methodOverride=require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { error } = require("console");
const {listingSchema}=require("./schmea.js");

const Review = require("../Major Project/models/review.js")

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

const validateListing=(res,req,next)=>{
    let {error} = listingSchema.validate(req.body);
        if(error){
            throw new ExpressError(400,error); 
        }else{
            next();
        }
}

//Index Route
app.get("/Listings",wrapAsync(async(req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
})); 

//New Route
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
});

//Show Route
app.get("/listings/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs",{listing});
}));

//create Route
app.post(
    "/listings",validateListing,
    wrapAsync(async(req,res,next)=>{
        
        const newlisting = new Listing(req.body.listing);
        await newlisting.save();
        res.redirect("/listings");  
}));

//Edit Route
app.get("/listings/:id/edit",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
}));

//Update Route
app.put("/listings/:id",
    validateListing, 
    wrapAsync( async (req,res)=>{
    let{id}=req.params;
    console.log(req.body)
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
}));

//Delete Route
app.delete("/listings/:id", wrapAsync(async(req,res)=>{
    let{id}=req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
}));

app.post("/listings/:id/reviews",async(req,res)=>{
   let listing = await Listing.findById(req.params.id);
   let newReview = await Review.create({
    comment: req.body.comment,
    rating: req.body.rating,
   });
   listing.reviews.push(newReview._id);
   await listing.save();

    res.redirect(`/success`);

//    res.send("new review saved");
});

app.get("/success",(req,res)=>{
    let message = "Added review"
    res.render("./success.ejs",{message});
});


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

app.all("*", (req,res,next)=>{
    next(new ExpressError(404,"Page Not Found!"));
});

app.use((err,req,res,next)=>{
    console.log(err)
    let {statusCode=500,message=" Something went wrongDarshan"}=err;
    res.status(statusCode).render("./error.ejs",{message})
   // res.status(statusCode).send(message);
});

app.listen(port,()=>{
    console.log(`Port ${port} is started`);
});