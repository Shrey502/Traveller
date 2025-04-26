const express = require('express'); 
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {validateReview, isLoggedIn,isReviewAuthor} = require("../middleware.js");

//review

router.post("/",
   isLoggedIn, 
   validateReview, wrapAsync(async(req,res)=>{
   let listing = await Listing.findById(req.params.id);
   let newReview = await Review.create({
    comment: req.body.comment,
    rating: req.body.rating,
    flash: req.flash("success","Created a new review!"),
   });
   newReview.author = req.user._id;
   listing.reviews.push(newReview);

   await newReview.save();
   await listing.save();

    res.redirect(`/listings/${listing._id}`);

//    res.send("new review saved");
}));

//Delete Review Route

router.delete("/:reviewId", 
    isLoggedIn,
    isReviewAuthor,
    wrapAsync(async(req,res)=>{
    let {id,reviewId} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${id}`);
}) );

module.exports = router;    