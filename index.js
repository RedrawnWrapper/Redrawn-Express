// vars
const express = require('express')
const app = express()
// app functions
app.use(require("./controllers"))
app.all('/', (req, res) => {
    if (req.url == "/") res.statusCode = 304;
    console.log(req.method, req.url, "-", res.statusCode);
    res.send('Hello, Anistick Studio Online is currently in beta. i know that its dead lol, but i just felt like trying something new.')
})
app.listen(process.env.PORT || 80)
