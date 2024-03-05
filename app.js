const express = require('express')
const app = express()
const port = 5000

app.get('/next3/:num1', (req,res) => {
    try {
        if(isNaN(req.params.num1)) {
            throw new Error("Error")
        }
        res.status(200).send((parseFloat(req.params.num1) + 3).toString());
    } catch(err) {
        res.status(200).send("Bad Request")
    }
})

const server = app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

module.exports = server