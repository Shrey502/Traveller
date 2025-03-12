const express = require('express');
const router = express.Router();

router.get("/", (req, res) => {
    res.send('Hello from user route');
});

router.get("/:id", (req, res) => {
    res.send("GET for user id");
});

router.post("/", (req, res) => {
    res.send("POST for user");
}); 

router.delete("/:id", (req, res) => {  
    res.send("DELETE for user id");
});

module.exports = router;

