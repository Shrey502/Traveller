const express = require('express'); 
const router = express.Router();
const User = require("../models/user.js"); // Use uppercase 'User' for the model to avoid conflicts
const wrapAsync = require('../utils/wrapAsync.js');
const passport = require("passport");
const { saveRedirectUrl } = require('../middleware.js');

router.get("/signup", (req, res) => {
    res.render("users/signup.ejs", { errorMessage: null });
});

router.post("/signup",
    wrapAsync( async (req, res) => {
    try{
        let { username, email, password } = req.body;
        const newUser = new User({ email, username }); // Use 'newUser' instead of 'user' to avoid conflict
        const registeredUser = await User.register(newUser, password); // Use 'User' for the model
        console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if (err) return next(err); // Handle login error
            req.flash("success", "Welcome to Traveller!");
        res.redirect("/listings");
        });
    }
    catch (e) {
        // req.flash("error", e.message);
        // res.redirect("/signup");
        res.render("users/signup.ejs", { errorMessage: e.message });
    }
}));

//login

router.get("/login", (req, res) => {
    res.render("users/login.ejs");
});

router.post("/login",
    saveRedirectUrl,
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true,
    }),
    async (req, res) => {
        req.flash("success", "Welcome back! to traveller!");
        const redirectUrl = req.session.redirectUrl || "/listings";
        res.redirect(redirectUrl);
    }
);

router.get("/logout", (req, res) => {
    req.logout((err) => {
        if (err) { next(err); }
        req.flash("success", "You are logged out!");
        res.redirect("/listings");
    })
});

module.exports = router;