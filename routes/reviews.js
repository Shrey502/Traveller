const express = require('express'); 
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {reviewSchema}=require("../schmea.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js")



const validateReview=(req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    console.log(req.body)
        if(error){
            let errMsg = error.details.map((el)=>el.message).join(",");
            throw new ExpressError(400,error); 
        }else{
            next();
        }
}

//review

router.post("/",validateReview, wrapAsync(async(req,res)=>{
   let listing = await Listing.findById(req.params.id);
   let newReview = await Review.create({
    comment: req.body.comment,
    rating: req.body.rating,
   });
   listing.reviews.push(newReview);

   await newReview.save();
   await listing.save();

    res.redirect(`/listings/${listing._id}`);

//    res.send("new review saved");
}));

//Delete Review Route

router.delete("/:reviewId", wrapAsync(async(req,res)=>{
    let {id,reviewId} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${id}`);
}) );

module.exports = router;    