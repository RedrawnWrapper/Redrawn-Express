const express = require('express')
const app = express()
app.all('/', (req, res) => {
    console.log(req.method, req.url, "-", res.statusCode);
    res.send('Yo!')
})
app.listen(process.env.PORT || 3000)
