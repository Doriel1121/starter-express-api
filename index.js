const express = require('express')
const bodyParser = require('body-parser')
const Attendence = require('./AttendenceController')
var cors = require('cors')
const mongo = require('mongoose');
const app = express()
// app.all('/', (req, res) => {
//     console.log("Just got a request!")
//     res.send('Yo!')
// })
console.log(process.env.USER_NAME);
app.listen(process.env.PORT || 3000)

mongo.connect(`mongodb+srv://${process.env.USER_NAME}:${process.env.DB_PASSWORD}@barberapp.tsqai.mongodb.net/myFirstDatabase?retryWrites=true&w=majority` , (res)=> {})
mongo.connection.on('open', function (ref) {
    console.log('Connected to mongo server.')
});
app
.use(bodyParser.json())
.use(cors())
app.get('/arrival' , async (req , response) => {
    console.log(req.body);
    Attendence.getAtendence(req.body , response , allAttendence => {
        // res.send(allAttendence);
        console.log('sssss');
        // response.download('attendances.txt', err => console.log(err))
    })
        // response.download('attendances.txt', err => console.log(err))
})

app.get('/arrival/:phone' , (req , res) => {
    console.log(req.params.phone);
    Attendence.getAtendenceByPhone(req.params.phone , res , single => {
        console.log(single);
        res.json(single);
    })
})

app.post('/newArrival' , (req , res) => {
    console.log(req.body);
    Attendence.setAtendence(req.body , res , allAttendence => {
        console.log(allAttendence);
        res.send(allAttendence);
    })
})
// const CommingCollection = db.collection("Comming");
// let attendence = await  CommingCollection.set("Timna", {
//     amount: "2",
//     isComming:true
// })
// const data = 
// console.log(data);
// console.log(attendence);