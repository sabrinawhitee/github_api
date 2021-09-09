const express = require("express");
const app = express();

app.get('/search', (req, res) => {
    const {url} = req.query;
    console.log(req)
    res.send(`<h1>Search results for: ${url}</h1>`);
})

app.listen(3000, ()=> {
    console.log("Listening on port 3000")
})