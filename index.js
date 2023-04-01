const express = require('express')
const CyclicDb = require("@cyclic.sh/dynamodb")
const db = CyclicDb("dull-gold-gazelle-bootCyclicDB")
const app = express()
app.all('/', (req, res) => {
    console.log("Just got a request!")
    res.send('Yo!')
})
app.listen(process.env.PORT || 3000)
console.log(process.env.PORT);
const data = db.collection("Approved");
let attendence = data.set("Timna", {
    amount: "2",
    isComming:true
})
// console.log(data);