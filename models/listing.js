const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        filename: {
            type: String,
            default: "default-filename.jpg"
        },
        url: {
            type: String,
            default: "https://plus.unsplash.com/premium_photo-1723983556109-7415d601c377?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            set: (v) => v === "" ? "https://plus.unsplash.com/premium_photo-1723983556109-7415d601c377?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" : v,
        }
    },
    price:Number,
    location:String,
    country:String,
    // price: {
    //     type: Number,
    //     required: true,
    //     min: 0,
    // },
    // location: {
    //     type: String,
    //     required: true,
    // },
    // country: {
    //     type: String,
    //     required: true,
    // },
    reviews:[
        {
            type: Schema.Types.ObjectId,
            ref:"Review",
        },
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
});

listingSchema.post("findOneAndDelete", async function (listing) {
    if (listing) {
        await Review.deleteMany({
            _id: {
                $in: listing.reviews,
            },
        });
    }
});
const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
