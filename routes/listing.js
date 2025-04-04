const express = require('express'); 
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema}=require("../schmea.js");
const Listing = require("../models/listing.js")


const validateListing=(req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
        if(error){
            let errMsg = error.details.map((el)=>el.message).join(",");
            throw new ExpressError(400,error); 
        }else{
            next();
        }
}

//Index Route
router.get("/",wrapAsync(async(req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
})); 

//New Route
router.get("/new",(req,res)=>{
    res.render("listings/new.ejs");
});

//Show Routeerror: remote-curl: error reading command stream from git
router.get("/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs",{listing});
}));

//create Route
router.post(
    "/",validateListing,
    wrapAsync(async(req,res,next)=>{
        
        const newlisting = new Listing(req.body.listing);
        await newlisting.save();
        res.redirect("/listings");  
}));

//Edit Route
router.get("/:id/edit",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
}));

//Update Route
router.put("/:id",
    validateListing, 
    wrapAsync( async (req,res)=>{
    let{id}=req.params;
    console.log(req.body)
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
}));

//Delete Route
router.delete("/:id", wrapAsync(async(req,res)=>{
    let{id}=req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
}));

module.exports = router;
