const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter= require("./routes/listing.js");
const reviewRouter = require("./routes/reviews.js");
const userRouter = require("./routes/user.js");

const port = 8081;
const MONGO_URL = "mongodb://127.0.0.1:27017/Traveller";

main()
    .then(() => {
        console.log("Connected to DB");
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const sessionOptions = {
    secret: "thisisnotagoodsecret",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
    }
};

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));// Use User.authenticate() for local strategy

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser()); 

app.use((req, res, next) => {
    res.locals.success = req.flash("success"); // Set the flash message to a local variable
    res.locals.error = req.flash("error"); // Set the flash message to a local variable
    res.locals.currentUser = req.user; // Set the current user to a local variable
    next();
});

// app.get("/demouser",async(req,res)=>{
//     let fakeuser = new User({
//         email:"student@gmail.com",
//         username:"student",
//     }); 
//     let ragisteredUser = await User.register(fakeuser,"helloworld");
//     res.send(ragisteredUser);   
// });

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});

app.use((err, req, res, next) => {
    console.log(err);
    let { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render("./error.ejs", { message });
    // res.status(statusCode).send(message);
});

app.listen(port, () => {
    console.log(`Port ${port} is started`);
});