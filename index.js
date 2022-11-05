const express = require('express')
const app = express()
app.all('/', (req, res) => {
    console.log(req.method, req.url, "-", res.statusCode);
    res.send('Hello, Anistick Studio Online is currently in beta. i know that its dead lol, but i just felt like trying something new.')
})
app.listen(process.env.PORT || 3000)
